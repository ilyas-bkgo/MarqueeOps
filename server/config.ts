import { z } from 'zod';

const rawConfig = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.7-flash'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const parsed = rawConfig.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.message).join(', ')}`);
}

if (parsed.data.NODE_ENV === 'production' && !parsed.data.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production and must be at least 32 characters');
}

if (parsed.data.NODE_ENV === 'production' && (!parsed.data.SUPABASE_URL || !parsed.data.SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production');
}

export const config = {
  ...parsed.data,
  // Persona switching is a local development aid only. It can never be enabled in production.
  demoMode: parsed.data.NODE_ENV !== 'production',
} as const;
