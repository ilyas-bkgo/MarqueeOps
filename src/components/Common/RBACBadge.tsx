import React from 'react';
import { Role, UserStatus, UserPlan } from '../../types';
import { ShieldCheck, ShieldAlert, Eye, CheckCircle2, Clock, Ban } from 'lucide-react';

export const RoleBadge: React.FC<{ role: Role; size?: 'sm' | 'md' }> = ({ role, size = 'md' }) => {
  if (role === 'Super Admin') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-xs ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
        <span>Super Admin</span>
      </span>
    );
  }

  if (role === 'Admin') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-zinc-100 text-zinc-800 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
        <span>Admin</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-zinc-50 text-zinc-600 border border-zinc-200 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Eye className="w-3.5 h-3.5 text-zinc-400" />
      <span>Viewer</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: UserStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  if (status === 'active') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="capitalize">Active</span>
      </span>
    );
  }

  if (status === 'invited') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <Clock className="w-3 h-3 text-amber-500" />
        <span className="capitalize">Invited</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Ban className="w-3 h-3 text-rose-500" />
      <span className="capitalize">Suspended</span>
    </span>
  );
};

export const PlanBadge: React.FC<{ plan: UserPlan }> = ({ plan }) => {
  const styles: Record<UserPlan, string> = {
    Enterprise: 'bg-zinc-900 text-zinc-100 border-zinc-800',
    Pro: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    Starter: 'bg-zinc-50 text-zinc-700 border-zinc-200',
    Free: 'bg-transparent text-zinc-500 border-zinc-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded border ${styles[plan]}`}>
      {plan}
    </span>
  );
};
