import React from 'react';
import { usePulseBoard } from '../context/PulseBoardContext';
import { DashboardView } from '../types';
import {
  LayoutDashboard,
  Users,
  Activity,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { RoleBadge } from './Common/RBACBadge';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, currentUser, users, activities, insights } = usePulseBoard();

  const navItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'users',
      label: 'Team & Access',
      icon: <Users className="w-4 h-4" />,
      badge: users.length,
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: <Activity className="w-4 h-4" />,
      badge: activities.length > 99 ? '99+' : activities.length,
    },
    {
      id: 'insights',
      label: 'Portfolio Insights',
      icon: <Sparkles className="w-4 h-4 text-violet-500" />,
      badge: insights.length,
      badgeColor: 'bg-violet-100 text-violet-700 font-semibold',
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-zinc-200 flex flex-col justify-between min-h-screen select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-xs">
              <Zap className="w-4 h-4 text-zinc-100 fill-zinc-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-zinc-900">MarqueeOps</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-600 block uppercase tracking-wider font-mono">
                Agency client operations
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-zinc-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${
                      isActive
                        ? 'bg-zinc-700 text-zinc-200'
                        : item.badgeColor || 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* RBAC Mode Summary Card */}
        <div className="px-3 mt-4">
          <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                Workspace access
              </span>
              <RoleBadge role={currentUser.role} size="sm" />
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {currentUser.role === 'Super Admin' &&
                'Full workspace control: manage teammates, client visibility, and operational settings.'}
              {currentUser.role === 'Admin' &&
                'Manage team access and account status. Permission changes are restricted.'}
              {currentUser.role === 'Viewer' &&
                'Read-only visibility across portfolio reporting and activity history.'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-zinc-100">
        <div className="px-3 py-1 flex items-center justify-between text-[10px] text-zinc-600 font-mono">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-zinc-500" /> Secure workspace
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
