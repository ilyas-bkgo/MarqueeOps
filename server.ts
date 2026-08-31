import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { z } from 'zod';
import { db, DEMO_PERSONAS } from './server/db';
import { verifySessionToken } from './server/auth';
import { config } from './server/config';
import { generateAIInsightsWithGemini } from './server/gemini';
import { CurrentSessionUser, Role } from './server/types';

export interface PulseBoardRequest extends Request {
  actor?: CurrentSessionUser;
}

const roles = ['Super Admin', 'Admin', 'Viewer'] as const;
const statuses = ['active', 'invited', 'suspended'] as const;
const plans = ['Enterprise', 'Pro', 'Starter', 'Free'] as const;
const userIdSchema = z.string().regex(/^usr-[\w-]+$/, 'Invalid user id');
const createUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  role: z.enum(roles).optional(),
  department: z.string().trim().min(1).max(100).optional(),
  plan: z.enum(plans).optional(),
  status: z.enum(statuses).optional(),
}).strict();
const updateUserSchema = createUserSchema.partial().omit({ role: true, status: true }).refine(
  (updates) => Object.keys(updates).length > 0,
  'At least one editable field is required',
);
const roleSchema = z.object({ role: z.enum(roles) }).strict();
const statusSchema = z.object({ status: z.enum(statuses) }).strict();

function apiError(res: Response, status: number, error: string) {
  return res.status(status).json({ error });
}

function getActorFromRequest(req: PulseBoardRequest): CurrentSessionUser | null {
  if (config.demoMode) {
    const requestedRole = req.headers['x-pulseboard-role'];
    const role = Array.isArray(requestedRole) ? requestedRole[0] : requestedRole;
    if (role && role in DEMO_PERSONAS) return DEMO_PERSONAS[role as Role];
    return db.getCurrentUser();
  }

  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return null;
  return verifySessionToken(authorization.slice('Bearer '.length));
}

function attachActor(req: PulseBoardRequest, _res: Response, next: NextFunction) {
  req.actor = getActorFromRequest(req) ?? undefined;
  next();
}

function requireAuth(req: PulseBoardRequest, res: Response, next: NextFunction) {
  if (!req.actor) return apiError(res, 401, 'Authentication required');
  next();
}

function requireRole(...permittedRoles: Role[]) {
  return (req: PulseBoardRequest, res: Response, next: NextFunction) => {
    if (!req.actor) return apiError(res, 401, 'Authentication required');
    if (!permittedRoles.includes(req.actor.role)) return apiError(res, 403, 'You are not authorized to perform this action');
    next();
  };
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false }));
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
  app.use(attachActor);

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.get('/api/session', requireAuth, (req: PulseBoardRequest, res: Response) => {
    res.json({ user: req.actor, ...(config.demoMode ? { availablePersonas: DEMO_PERSONAS } : {}) });
  });

  app.post('/api/session/switch', (req: PulseBoardRequest, res: Response) => {
    if (!config.demoMode) return apiError(res, 404, 'Not found');
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, 400, 'A valid role is required');
    const updatedUser = db.switchRole(parsed.data.role);
    res.json({ user: updatedUser, message: `Switched session active role to ${parsed.data.role}` });
  });

  app.get('/api/metrics', requireAuth, (_req, res) => res.json(db.getMetrics()));
  app.get('/api/users', requireAuth, (_req, res) => res.json(db.getUsers()));

  app.post('/api/users', requireRole('Super Admin', 'Admin'), (req: PulseBoardRequest, res: Response) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, 400, parsed.error.issues[0].message);
    const result = db.createUser(parsed.data, req.actor!);
    res.status(201).json(result);
  });

  app.put('/api/users/:id', requireRole('Super Admin', 'Admin'), (req: PulseBoardRequest, res: Response) => {
    const id = userIdSchema.safeParse(req.params.id);
    const updates = updateUserSchema.safeParse(req.body);
    if (!id.success || !updates.success) return apiError(res, 400, !id.success ? id.error.issues[0].message : updates.error.issues[0].message);
    const result = db.updateUser(id.data, updates.data, req.actor!);
    if (!result) return apiError(res, 404, 'User record not found');
    res.json(result);
  });

  app.patch('/api/users/:id/role', requireRole('Super Admin'), (req: PulseBoardRequest, res: Response) => {
    const id = userIdSchema.safeParse(req.params.id);
    const body = roleSchema.safeParse(req.body);
    if (!id.success || !body.success) return apiError(res, 400, !id.success ? id.error.issues[0].message : body.error.issues[0].message);
    try {
      const result = db.updateUserRole(id.data, body.data.role, req.actor!);
      if (!result) return apiError(res, 404, 'User record not found');
      res.json(result);
    } catch (error) {
      apiError(res, 403, error instanceof Error ? error.message : 'Action prohibited');
    }
  });

  app.patch('/api/users/:id/status', requireRole('Super Admin', 'Admin'), (req: PulseBoardRequest, res: Response) => {
    const id = userIdSchema.safeParse(req.params.id);
    const body = statusSchema.safeParse(req.body);
    if (!id.success || !body.success) return apiError(res, 400, !id.success ? id.error.issues[0].message : body.error.issues[0].message);
    try {
      const result = db.updateUserStatus(id.data, body.data.status, req.actor!);
      if (!result) return apiError(res, 404, 'User record not found');
      res.json(result);
    } catch (error) {
      apiError(res, 403, error instanceof Error ? error.message : 'Action prohibited');
    }
  });

  app.delete('/api/users/:id', requireRole('Super Admin', 'Admin'), (req: PulseBoardRequest, res: Response) => {
    const id = userIdSchema.safeParse(req.params.id);
    if (!id.success) return apiError(res, 400, id.error.issues[0].message);
    try {
      const result = db.deleteUser(id.data, req.actor!);
      if (!result) return apiError(res, 404, 'User record not found');
      res.json(result);
    } catch (error) {
      apiError(res, 403, error instanceof Error ? error.message : 'Action prohibited');
    }
  });

  app.get('/api/activities', requireAuth, (req, res) => {
    const parsed = z.coerce.number().int().min(1).max(100).default(100).safeParse(req.query.limit);
    if (!parsed.success) return apiError(res, 400, 'limit must be an integer between 1 and 100');
    res.json(db.getActivities(parsed.data));
  });

  app.get('/api/insights', requireAuth, (_req, res) => res.json(db.getInsights()));
  app.post('/api/insights/generate', requireRole('Super Admin', 'Admin'), async (req: PulseBoardRequest, res: Response) => {
    try {
      const freshInsights = await generateAIInsightsWithGemini(db.getMetrics(), db.getUsers(), db.getActivities(15));
      db.setInsights(freshInsights);
      db.logActivity({ action: 'INSIGHTS_GENERATED', description: `${req.actor!.name} refreshed AI executive insight cards`, severity: 'info', metadata: { insightCount: freshInsights.length, source: freshInsights[0]?.source || 'gemini' } }, req.actor!);
      res.json({ insights: freshInsights, refreshedAt: new Date().toISOString(), source: freshInsights[0]?.source || 'gemini' });
    } catch (error) {
      console.error('Error generating insights:', error);
      apiError(res, 500, 'Failed to synthesize AI insights');
    }
  });

  app.post('/api/seed/reset', requireRole('Super Admin'), (_req, res) => {
    if (!config.demoMode) return apiError(res, 404, 'Not found');
    db.resetToSeed();
    res.json({ message: 'Demo data restored', metrics: db.getMetrics(), users: db.getUsers(), activities: db.getActivities(), insights: db.getInsights(), currentUser: db.getCurrentUser() });
  });

  return app;
}

const app = createApp();

async function startServer() {
  if (config.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(config.PORT, '0.0.0.0', () => console.log(`PulseBoard server running on port ${config.PORT}`));
}

if (config.NODE_ENV !== 'test') void startServer();
