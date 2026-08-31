export type Role = 'Super Admin' | 'Admin' | 'Viewer';

export type UserStatus = 'active' | 'invited' | 'suspended';

export type UserPlan = 'Enterprise' | 'Pro' | 'Starter' | 'Free';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
  department: string;
  plan: UserPlan;
  avatar?: string;
  mfaEnabled: boolean;
  invitedBy?: string;
}

export type ActivityAction =
  | 'USER_CREATED'
  | 'ROLE_CHANGED'
  | 'STATUS_CHANGED'
  | 'USER_DELETED'
  | 'SETTINGS_UPDATED'
  | 'INSIGHTS_GENERATED'
  | 'SECURITY_ALERT'
  | 'USER_INVITED'
  | 'MFA_UPDATED'
  | 'EXPORT_DATA'
  | 'SEED_RESET';

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: Role | 'System';
  action: ActivityAction;
  targetId?: string;
  targetName?: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  metadata?: Record<string, any>;
}

export interface MetricOverview {
  totalUsers: number;
  totalUsersTrend: number;
  activeToday: number;
  activeTodayTrend: number;
  signupsThisWeek: number;
  signupsThisWeekTrend: number;
  churnRate: number;
  churnRateTrend: number;
  mrr: number;
  mrrTrend: number;
  chartData: Array<{
    date: string;
    signups: number;
    activeUsers: number;
    conversions: number;
  }>;
  segmentDistribution: Array<{
    name: string;
    value: number;
    color: string;
    growth: string;
  }>;
  roleCounts: {
    superAdmin: number;
    admin: number;
    viewer: number;
  };
  statusCounts: {
    active: number;
    invited: number;
    suspended: number;
  };
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'Growth' | 'Retention' | 'Security' | 'Segment' | 'Performance';
  summary: string;
  impact: 'positive' | 'high' | 'medium' | 'warning';
  metric: string;
  recommendation: string;
  generatedAt: string;
  confidence: number;
  tags: string[];
  source?: 'gemini' | 'grounded-engine';
}

export interface CurrentSessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
}

export type DashboardView = 'overview' | 'users' | 'activity' | 'insights';
