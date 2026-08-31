import fs from 'fs';
import path from 'path';
import { AppUser, ActivityLog, MetricOverview, AIInsight, CurrentSessionUser, Role } from './types';
import { generateGroundedInsights } from './gemini';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'pulseboard_store.json');

export const DEMO_PERSONAS: Record<Role, CurrentSessionUser> = {
  'Super Admin': {
    id: 'persona-super-admin',
    name: 'Elena Rostova',
    email: 'elena.rostova@pulseboard.io',
    role: 'Super Admin',
    avatar: 'ER',
    department: 'Executive Engineering',
  },
  'Admin': {
    id: 'persona-admin',
    name: 'Marcus Vance',
    email: 'marcus.vance@pulseboard.io',
    role: 'Admin',
    avatar: 'MV',
    department: 'Operations & Support',
  },
  'Viewer': {
    id: 'persona-viewer',
    name: 'Maya Lin',
    email: 'maya.lin@pulseboard.io',
    role: 'Viewer',
    avatar: 'ML',
    department: 'Product Analytics',
  },
};

function getDaysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function getHoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export function createInitialSeedData(): {
  users: AppUser[];
  activities: ActivityLog[];
  insights: AIInsight[];
} {
  const users: AppUser[] = [
    {
      id: 'usr-001',
      name: 'Elena Rostova',
      email: 'elena.rostova@pulseboard.io',
      role: 'Super Admin',
      status: 'active',
      joinedAt: getDaysAgo(60),
      lastActive: getHoursAgo(1),
      department: 'Executive Engineering',
      plan: 'Enterprise',
      avatar: 'ER',
      mfaEnabled: true,
    },
    {
      id: 'usr-002',
      name: 'Marcus Vance',
      email: 'marcus.vance@pulseboard.io',
      role: 'Admin',
      status: 'active',
      joinedAt: getDaysAgo(45),
      lastActive: getHoursAgo(2),
      department: 'Operations & Support',
      plan: 'Enterprise',
      avatar: 'MV',
      mfaEnabled: true,
    },
    {
      id: 'usr-003',
      name: 'Maya Lin',
      email: 'maya.lin@pulseboard.io',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(30),
      lastActive: getHoursAgo(3),
      department: 'Product Analytics',
      plan: 'Pro',
      avatar: 'ML',
      mfaEnabled: true,
    },
    {
      id: 'usr-004',
      name: 'Sarah Chen',
      email: 'sarah.chen@stripe-fin.com',
      role: 'Admin',
      status: 'active',
      joinedAt: getDaysAgo(28),
      lastActive: getHoursAgo(5),
      department: 'Fintech',
      plan: 'Enterprise',
      avatar: 'SC',
      mfaEnabled: true,
    },
    {
      id: 'usr-005',
      name: 'David Miller',
      email: 'david.m@linear-teams.io',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(24),
      lastActive: getHoursAgo(12),
      department: 'Developer Tools',
      plan: 'Enterprise',
      avatar: 'DM',
      mfaEnabled: false,
    },
    {
      id: 'usr-006',
      name: 'Priya Sharma',
      email: 'priya.s@novamed.health',
      role: 'Admin',
      status: 'active',
      joinedAt: getDaysAgo(22),
      lastActive: getDaysAgo(1),
      department: 'HealthTech',
      plan: 'Pro',
      avatar: 'PS',
      mfaEnabled: true,
    },
    {
      id: 'usr-007',
      name: 'Liam O’Connor',
      email: 'liam.oc@celtic-pay.ie',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(19),
      lastActive: getHoursAgo(8),
      department: 'Fintech',
      plan: 'Pro',
      avatar: 'LO',
      mfaEnabled: false,
    },
    {
      id: 'usr-008',
      name: 'Yuki Tanaka',
      email: 'yuki.tanaka@tokyo-saas.jp',
      role: 'Viewer',
      status: 'invited',
      joinedAt: getDaysAgo(16),
      lastActive: getDaysAgo(16),
      department: 'Enterprise SaaS',
      plan: 'Enterprise',
      avatar: 'YT',
      mfaEnabled: false,
      invitedBy: 'Elena Rostova',
    },
    {
      id: 'usr-009',
      name: 'Lucas Silva',
      email: 'lucas.silva@mercadotech.br',
      role: 'Admin',
      status: 'active',
      joinedAt: getDaysAgo(14),
      lastActive: getHoursAgo(4),
      department: 'E-Commerce',
      plan: 'Pro',
      avatar: 'LS',
      mfaEnabled: true,
    },
    {
      id: 'usr-010',
      name: 'Emily Thorne',
      email: 'emily.thorne@nordicscale.se',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(12),
      lastActive: getHoursAgo(6),
      department: 'Enterprise SaaS',
      plan: 'Starter',
      avatar: 'ET',
      mfaEnabled: false,
    },
    {
      id: 'usr-011',
      name: 'Zoe Kravitz',
      email: 'zoe.k@quantumcloud.co',
      role: 'Viewer',
      status: 'suspended',
      joinedAt: getDaysAgo(35),
      lastActive: getDaysAgo(10),
      department: 'Developer Tools',
      plan: 'Starter',
      avatar: 'ZK',
      mfaEnabled: false,
    },
    {
      id: 'usr-012',
      name: 'Alexander Hayes',
      email: 'alex.hayes@apexlogistics.com',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(10),
      lastActive: getHoursAgo(14),
      department: 'Enterprise SaaS',
      plan: 'Enterprise',
      avatar: 'AH',
      mfaEnabled: true,
    },
    {
      id: 'usr-013',
      name: 'Fatima Al-Mansoor',
      email: 'fatima@gulfpay.ae',
      role: 'Admin',
      status: 'active',
      joinedAt: getDaysAgo(8),
      lastActive: getHoursAgo(2),
      department: 'Fintech',
      plan: 'Enterprise',
      avatar: 'FA',
      mfaEnabled: true,
    },
    {
      id: 'usr-014',
      name: 'Julian Vance',
      email: 'julian.v@biovault.org',
      role: 'Viewer',
      status: 'invited',
      joinedAt: getDaysAgo(6),
      lastActive: getDaysAgo(6),
      department: 'HealthTech',
      plan: 'Pro',
      avatar: 'JV',
      mfaEnabled: false,
      invitedBy: 'Marcus Vance',
    },
    {
      id: 'usr-015',
      name: 'Clara Oswald',
      email: 'clara.o@tardis-ai.uk',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(5),
      lastActive: getHoursAgo(3),
      department: 'Developer Tools',
      plan: 'Pro',
      avatar: 'CO',
      mfaEnabled: true,
    },
    {
      id: 'usr-016',
      name: 'Mateo Rossi',
      email: 'mateo.rossi@milano-retail.it',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(4),
      lastActive: getHoursAgo(9),
      department: 'E-Commerce',
      plan: 'Starter',
      avatar: 'MR',
      mfaEnabled: false,
    },
    {
      id: 'usr-017',
      name: 'Hannah Abbott',
      email: 'hannah@huffle-pay.com',
      role: 'Viewer',
      status: 'active',
      joinedAt: getDaysAgo(3),
      lastActive: getHoursAgo(1),
      department: 'Fintech',
      plan: 'Free',
      avatar: 'HA',
      mfaEnabled: false,
    },
    {
      id: 'usr-018',
      name: 'Devon Miles',
      email: 'devon.miles@knightsecurity.net',
      role: 'Admin',
      status: 'active',
      joinedAt: getDaysAgo(2),
      lastActive: getHoursAgo(4),
      department: 'Security & Infra',
      plan: 'Enterprise',
      avatar: 'DM',
      mfaEnabled: true,
    },
    {
      id: 'usr-019',
      name: 'Chloe Bennett',
      email: 'chloe.b@shield-dev.io',
      role: 'Viewer',
      status: 'invited',
      joinedAt: getDaysAgo(1),
      lastActive: getDaysAgo(1),
      department: 'Developer Tools',
      plan: 'Starter',
      avatar: 'CB',
      mfaEnabled: false,
      invitedBy: 'Devon Miles',
    },
    {
      id: 'usr-020',
      name: 'Tariq Johnson',
      email: 'tariq.j@apex-analytics.com',
      role: 'Viewer',
      status: 'suspended',
      joinedAt: getDaysAgo(40),
      lastActive: getDaysAgo(15),
      department: 'Enterprise SaaS',
      plan: 'Pro',
      avatar: 'TJ',
      mfaEnabled: false,
    },
  ];

  const activities: ActivityLog[] = [
    {
      id: 'act-001',
      actorId: 'usr-001',
      actorName: 'Elena Rostova',
      actorEmail: 'elena.rostova@pulseboard.io',
      actorRole: 'Super Admin',
      action: 'ROLE_CHANGED',
      targetId: 'usr-004',
      targetName: 'Sarah Chen',
      description: 'Elena Rostova (Super Admin) updated role of Sarah Chen from Viewer to Admin',
      timestamp: getHoursAgo(2),
      severity: 'success',
      metadata: { fromRole: 'Viewer', toRole: 'Admin', module: 'RBAC Security' },
    },
    {
      id: 'act-002',
      actorId: 'usr-002',
      actorName: 'Marcus Vance',
      actorEmail: 'marcus.vance@pulseboard.io',
      actorRole: 'Admin',
      action: 'USER_INVITED',
      targetId: 'usr-014',
      targetName: 'Julian Vance',
      description: 'Marcus Vance (Admin) invited Julian Vance to HealthTech segment',
      timestamp: getHoursAgo(6),
      severity: 'info',
      metadata: { department: 'HealthTech', plan: 'Pro' },
    },
    {
      id: 'act-003',
      actorId: 'system',
      actorName: 'PulseBoard AI',
      actorEmail: 'ai-daemon@pulseboard.io',
      actorRole: 'System',
      action: 'INSIGHTS_GENERATED',
      description: 'Autonomous insight engine synthesized 5 key executive performance signals',
      timestamp: getHoursAgo(8),
      severity: 'info',
      metadata: { model: 'gemini-3.7-flash', executionMs: 420 },
    },
    {
      id: 'act-004',
      actorId: 'usr-001',
      actorName: 'Elena Rostova',
      actorEmail: 'elena.rostova@pulseboard.io',
      actorRole: 'Super Admin',
      action: 'STATUS_CHANGED',
      targetId: 'usr-011',
      targetName: 'Zoe Kravitz',
      description: 'Elena Rostova (Super Admin) suspended account Zoe Kravitz following policy breach',
      timestamp: getDaysAgo(1, 4),
      severity: 'warning',
      metadata: { reason: 'Dormant API credential flag', previousStatus: 'active' },
    },
    {
      id: 'act-005',
      actorId: 'usr-004',
      actorName: 'Sarah Chen',
      actorEmail: 'sarah.chen@stripe-fin.com',
      actorRole: 'Admin',
      action: 'MFA_UPDATED',
      targetId: 'usr-004',
      targetName: 'Sarah Chen',
      description: 'Sarah Chen enforced FIDO2 Hardware MFA token for Fintech workspace',
      timestamp: getDaysAgo(1, 8),
      severity: 'success',
      metadata: { mfaType: 'WebAuthn / YubiKey' },
    },
    {
      id: 'act-006',
      actorId: 'usr-018',
      actorName: 'Devon Miles',
      actorEmail: 'devon.miles@knightsecurity.net',
      actorRole: 'Admin',
      action: 'USER_INVITED',
      targetId: 'usr-019',
      targetName: 'Chloe Bennett',
      description: 'Devon Miles (Admin) dispatched onboarding invite to Chloe Bennett',
      timestamp: getDaysAgo(1, 12),
      severity: 'info',
      metadata: { department: 'Developer Tools', role: 'Viewer' },
    },
    {
      id: 'act-007',
      actorId: 'usr-001',
      actorName: 'Elena Rostova',
      actorEmail: 'elena.rostova@pulseboard.io',
      actorRole: 'Super Admin',
      action: 'ROLE_CHANGED',
      targetId: 'usr-018',
      targetName: 'Devon Miles',
      description: 'Elena Rostova elevated Devon Miles to Security Admin role',
      timestamp: getDaysAgo(2),
      severity: 'success',
      metadata: { fromRole: 'Viewer', toRole: 'Admin', verifiedBy: 'Elena Rostova' },
    },
    {
      id: 'act-008',
      actorId: 'system',
      actorName: 'System Security Watch',
      actorEmail: 'security@pulseboard.io',
      actorRole: 'System',
      action: 'SECURITY_ALERT',
      description: 'Automated IP anomaly checked: 14 concurrent logins validated across North America',
      timestamp: getDaysAgo(2, 6),
      severity: 'info',
      metadata: { status: 'cleared', riskScore: 0.04 },
    },
    {
      id: 'act-009',
      actorId: 'usr-002',
      actorName: 'Marcus Vance',
      actorEmail: 'marcus.vance@pulseboard.io',
      actorRole: 'Admin',
      action: 'EXPORT_DATA',
      description: 'Marcus Vance exported 30-day compliance audit log to encrypted CSV',
      timestamp: getDaysAgo(3),
      severity: 'info',
      metadata: { rowCount: 142, format: 'CSV' },
    },
    {
      id: 'act-010',
      actorId: 'usr-001',
      actorName: 'Elena Rostova',
      actorEmail: 'elena.rostova@pulseboard.io',
      actorRole: 'Super Admin',
      action: 'SETTINGS_UPDATED',
      description: 'Elena Rostova updated Session Timeout policy to 48 hours for Super Admins',
      timestamp: getDaysAgo(4),
      severity: 'info',
      metadata: { previousTimeout: '24h', newTimeout: '48h' },
    },
    {
      id: 'act-011',
      actorId: 'usr-006',
      actorName: 'Priya Sharma',
      actorEmail: 'priya.s@novamed.health',
      actorRole: 'Admin',
      action: 'USER_CREATED',
      targetId: 'usr-014',
      targetName: 'Julian Vance',
      description: 'Priya Sharma provisioned HealthTech workspace permissions',
      timestamp: getDaysAgo(6),
      severity: 'info',
    },
    {
      id: 'act-012',
      actorId: 'system',
      actorName: 'PulseBoard AI',
      actorEmail: 'ai-daemon@pulseboard.io',
      actorRole: 'System',
      action: 'INSIGHTS_GENERATED',
      description: 'Weekly cohort analysis completed with 96% anomaly detection accuracy',
      timestamp: getDaysAgo(7),
      severity: 'info',
    },
  ];

  const dummyMetrics: MetricOverview = {
    totalUsers: 1428,
    totalUsersTrend: 14.2,
    activeToday: 384,
    activeTodayTrend: 8.6,
    signupsThisWeek: 96,
    signupsThisWeekTrend: 22.4,
    churnRate: 1.8,
    churnRateTrend: -0.4,
    mrr: 48250,
    mrrTrend: 11.8,
    chartData: [
      { date: 'Mon', signups: 14, activeUsers: 310, conversions: 4 },
      { date: 'Tue', signups: 18, activeUsers: 335, conversions: 6 },
      { date: 'Wed', signups: 22, activeUsers: 360, conversions: 7 },
      { date: 'Thu', signups: 19, activeUsers: 348, conversions: 5 },
      { date: 'Fri', signups: 28, activeUsers: 384, conversions: 11 },
      { date: 'Sat', signups: 15, activeUsers: 290, conversions: 3 },
      { date: 'Sun', signups: 12, activeUsers: 275, conversions: 2 },
    ],
    segmentDistribution: [
      { name: 'Fintech', value: 498, color: '#18181b', growth: '+28.4%' },
      { name: 'Developer Tools', value: 372, color: '#3f3f46', growth: '+18.1%' },
      { name: 'Enterprise SaaS', value: 284, color: '#71717a', growth: '+14.6%' },
      { name: 'HealthTech', value: 164, color: '#a1a1aa', growth: '+12.0%' },
      { name: 'E-Commerce', value: 110, color: '#d4d4d8', growth: '+9.2%' },
    ],
    roleCounts: {
      superAdmin: 1,
      admin: 5,
      viewer: 14,
    },
    statusCounts: {
      active: 15,
      invited: 3,
      suspended: 2,
    },
  };

  const insights = generateGroundedInsights(dummyMetrics, users);

  return { users, activities, insights };
}

class PulseBoardDatabase {
  private users: AppUser[] = [];
  private activities: ActivityLog[] = [];
  private insights: AIInsight[] = [];
  private currentSessionUser: CurrentSessionUser = DEMO_PERSONAS['Super Admin'];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.activities)) {
          this.users = parsed.users;
          this.activities = parsed.activities;
          this.insights = parsed.insights || [];
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read store file, re-initializing default seed:', err);
    }
    const seed = createInitialSeedData();
    this.users = seed.users;
    this.activities = seed.activities;
    this.insights = seed.insights;
    this.saveData();
  }

  private saveData() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            users: this.users,
            activities: this.activities,
            insights: this.insights,
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      console.error('Failed to write PulseBoard store file:', err);
    }
  }

  public resetToSeed(): void {
    const seed = createInitialSeedData();
    this.users = seed.users;
    this.activities = seed.activities;
    this.insights = seed.insights;
    this.currentSessionUser = DEMO_PERSONAS['Super Admin'];
    this.saveData();
  }

  // Session & Personas
  public getCurrentUser(): CurrentSessionUser {
    return this.currentSessionUser;
  }

  public switchRole(role: Role): CurrentSessionUser {
    if (DEMO_PERSONAS[role]) {
      this.currentSessionUser = DEMO_PERSONAS[role];
    }
    return this.currentSessionUser;
  }

  // Users
  public getUsers(): AppUser[] {
    return [...this.users];
  }

  public getUserById(id: string): AppUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public createUser(userData: Partial<AppUser>, actor: CurrentSessionUser): { user: AppUser; activity: ActivityLog } {
    const now = new Date().toISOString();
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const initials = (userData.name || 'User')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: AppUser = {
      id,
      name: userData.name || 'New Member',
      email: userData.email || `user-${Date.now()}@example.com`,
      role: actor.role === 'Super Admin' ? userData.role || 'Viewer' : 'Viewer', // Only Super Admin can assign elevated role
      status: userData.status || 'invited',
      joinedAt: now,
      lastActive: now,
      department: userData.department || 'Enterprise SaaS',
      plan: userData.plan || 'Pro',
      avatar: initials,
      mfaEnabled: false,
      invitedBy: actor.name,
    };

    this.users.unshift(newUser);

    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_CREATED',
      targetId: newUser.id,
      targetName: newUser.name,
      description: `${actor.name} (${actor.role}) added user ${newUser.name} (${newUser.email}) with role ${newUser.role}`,
      timestamp: now,
      severity: 'info',
      metadata: { role: newUser.role, department: newUser.department, status: newUser.status },
    };

    this.activities.unshift(activity);
    this.saveData();
    return { user: newUser, activity };
  }

  public updateUser(
    id: string,
    updates: Partial<AppUser>,
    actor: CurrentSessionUser
  ): { user: AppUser; activity: ActivityLog } | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = this.users[index];
    const previousRole = current.role;
    const previousStatus = current.status;
    const now = new Date().toISOString();

    // Enforce RBAC: Non-Super Admins CANNOT change user roles
    let assignedRole = current.role;
    if (updates.role && updates.role !== current.role) {
      if (actor.role === 'Super Admin') {
        assignedRole = updates.role;
      }
    }

    const updatedUser: AppUser = {
      ...current,
      ...updates,
      role: assignedRole,
    };

    this.users[index] = updatedUser;

    let action: ActivityLog['action'] = 'SETTINGS_UPDATED';
    let description = `${actor.name} (${actor.role}) updated details for ${updatedUser.name}`;
    let severity: ActivityLog['severity'] = 'info';

    if (assignedRole !== previousRole) {
      action = 'ROLE_CHANGED';
      description = `${actor.name} (${actor.role}) changed role of ${updatedUser.name} from ${previousRole} to ${assignedRole}`;
      severity = 'success';
    } else if (updates.status && updates.status !== previousStatus) {
      action = 'STATUS_CHANGED';
      description = `${actor.name} (${actor.role}) changed status of ${updatedUser.name} to ${updates.status}`;
      severity = updates.status === 'suspended' ? 'warning' : 'info';
    }

    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      action,
      targetId: updatedUser.id,
      targetName: updatedUser.name,
      description,
      timestamp: now,
      severity,
      metadata: { previousRole, newRole: assignedRole, previousStatus, newStatus: updatedUser.status },
    };

    this.activities.unshift(activity);
    this.saveData();
    return { user: updatedUser, activity };
  }

  public updateUserRole(
    id: string,
    newRole: Role,
    actor: CurrentSessionUser
  ): { user: AppUser; activity: ActivityLog } | null {
    if (actor.role !== 'Super Admin') {
      throw new Error('Forbidden: Only Super Admin is authorized to modify user roles');
    }

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = this.users[index];
    const previousRole = current.role;
    current.role = newRole;

    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'ROLE_CHANGED',
      targetId: current.id,
      targetName: current.name,
      description: `${actor.name} (${actor.role}) modified role of ${current.name} from ${previousRole} to ${newRole}`,
      timestamp: new Date().toISOString(),
      severity: 'success',
      metadata: { fromRole: previousRole, toRole: newRole },
    };

    this.activities.unshift(activity);
    this.saveData();
    return { user: current, activity };
  }

  public updateUserStatus(
    id: string,
    newStatus: AppUser['status'],
    actor: CurrentSessionUser
  ): { user: AppUser; activity: ActivityLog } | null {
    if (actor.role === 'Viewer') {
      throw new Error('Forbidden: Viewers cannot modify user status');
    }

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = this.users[index];
    const previousStatus = current.status;
    current.status = newStatus;

    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'STATUS_CHANGED',
      targetId: current.id,
      targetName: current.name,
      description: `${actor.name} (${actor.role}) set status of ${current.name} to ${newStatus}`,
      timestamp: new Date().toISOString(),
      severity: newStatus === 'suspended' ? 'warning' : 'info',
      metadata: { fromStatus: previousStatus, toStatus: newStatus },
    };

    this.activities.unshift(activity);
    this.saveData();
    return { user: current, activity };
  }

  public deleteUser(id: string, actor: CurrentSessionUser): { success: boolean; activity: ActivityLog } | null {
    if (actor.role === 'Viewer') {
      throw new Error('Forbidden: Viewers cannot delete users');
    }

    const targetUser = this.users.find((u) => u.id === id);
    if (!targetUser) return null;

    // Only Super Admin can delete other Admins
    if (targetUser.role === 'Super Admin' || (targetUser.role === 'Admin' && actor.role !== 'Super Admin')) {
      throw new Error('Forbidden: Only Super Admin can delete admin accounts');
    }

    this.users = this.users.filter((u) => u.id !== id);

    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_DELETED',
      targetId: id,
      targetName: targetUser.name,
      description: `${actor.name} (${actor.role}) deleted user account ${targetUser.name} (${targetUser.email})`,
      timestamp: new Date().toISOString(),
      severity: 'warning',
      metadata: { deletedRole: targetUser.role, email: targetUser.email },
    };

    this.activities.unshift(activity);
    this.saveData();
    return { success: true, activity };
  }

  // Activities
  public getActivities(limit = 100): ActivityLog[] {
    return [...this.activities].slice(0, limit);
  }

  public logActivity(activityData: Partial<ActivityLog>, actor: CurrentSessionUser): ActivityLog {
    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: activityData.action || 'SETTINGS_UPDATED',
      targetId: activityData.targetId,
      targetName: activityData.targetName,
      description: activityData.description || 'System action executed',
      timestamp: new Date().toISOString(),
      severity: activityData.severity || 'info',
      metadata: activityData.metadata,
    };
    this.activities.unshift(activity);
    this.saveData();
    return activity;
  }

  // Insights
  public getInsights(): AIInsight[] {
    if (this.insights.length === 0) {
      this.insights = generateGroundedInsights(this.getMetrics(), this.users);
      this.saveData();
    }
    return [...this.insights];
  }

  public setInsights(newInsights: AIInsight[]): AIInsight[] {
    this.insights = newInsights;
    this.saveData();
    return this.insights;
  }

  // Dynamic Metrics Computation
  public getMetrics(): MetricOverview {
    const totalCount = this.users.length;
    const activeCount = this.users.filter((u) => u.status === 'active').length;
    const invitedCount = this.users.filter((u) => u.status === 'invited').length;
    const suspendedCount = this.users.filter((u) => u.status === 'suspended').length;

    const superAdminCount = this.users.filter((u) => u.role === 'Super Admin').length;
    const adminCount = this.users.filter((u) => u.role === 'Admin').length;
    const viewerCount = this.users.filter((u) => u.role === 'Viewer').length;

    // Segment aggregates
    const segmentMap: Record<string, number> = {};
    this.users.forEach((u) => {
      segmentMap[u.department] = (segmentMap[u.department] || 0) + 1;
    });

    const segmentColors = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'];
    const segmentGrowths = ['+28.4%', '+18.1%', '+14.6%', '+12.0%', '+9.2%', '+6.5%'];

    const segmentDistribution = Object.keys(segmentMap).map((name, i) => ({
      name,
      value: segmentMap[name],
      color: segmentColors[i % segmentColors.length],
      growth: segmentGrowths[i % segmentGrowths.length],
    }));

    // Portfolio metrics are intentionally tied to the records in this workspace.
    const scaledTotalUsers = totalCount;
    const scaledActiveToday = activeCount;
    const scaledSignups = this.users.filter((user) => {
      const joinedAt = new Date(user.joinedAt).getTime();
      return joinedAt >= Date.now() - 7 * 24 * 60 * 60 * 1000;
    }).length;
    const mrrCalc = 42000 + (this.users.filter((u) => u.plan === 'Enterprise').length * 2400) + (this.users.filter((u) => u.plan === 'Pro').length * 800);

    return {
      totalUsers: scaledTotalUsers,
      totalUsersTrend: 14.2,
      activeToday: scaledActiveToday,
      activeTodayTrend: 8.6,
      signupsThisWeek: scaledSignups,
      signupsThisWeekTrend: 22.4,
      churnRate: 1.8,
      churnRateTrend: -0.4,
      mrr: mrrCalc,
      mrrTrend: 11.8,
      chartData: [
        { date: 'Mon', signups: 14, activeUsers: 310, conversions: 4 },
        { date: 'Tue', signups: 18, activeUsers: 335, conversions: 6 },
        { date: 'Wed', signups: 22, activeUsers: 360, conversions: 7 },
        { date: 'Thu', signups: 19, activeUsers: 348, conversions: 5 },
        { date: 'Fri', signups: 28, activeUsers: 384, conversions: 11 },
        { date: 'Sat', signups: 15, activeUsers: 290, conversions: 3 },
        { date: 'Sun', signups: 12, activeUsers: 275, conversions: 2 },
      ],
      segmentDistribution,
      roleCounts: {
        superAdmin: superAdminCount,
        admin: adminCount,
        viewer: viewerCount,
      },
      statusCounts: {
        active: activeCount,
        invited: invitedCount,
        suspended: suspendedCount,
      },
    };
  }
}

export const db = new PulseBoardDatabase();
