import React from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { ActivityLog } from '../../types';
import { Activity, ArrowRight, ShieldAlert, UserCheck, Key, Settings, UserMinus } from 'lucide-react';
import { RoleBadge } from '../Common/RBACBadge';

export const OverviewActivityFeed: React.FC = () => {
  const { activities, setActiveView } = usePulseBoard();

  const getActionIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'ROLE_CHANGED':
        return <ShieldAlert className="w-3.5 h-3.5 text-violet-600" />;
      case 'USER_INVITED':
      case 'USER_CREATED':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'USER_DELETED':
        return <UserMinus className="w-3.5 h-3.5 text-rose-600" />;
      case 'MFA_UPDATED':
      case 'SECURITY_ALERT':
        return <Key className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Settings className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  const recent = activities.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-700" />
          <h3 className="text-sm font-bold text-zinc-900">Recent Audit Log Stream</h3>
        </div>
        <button
          onClick={() => setActiveView('activity')}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <span>Full Audit Trail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-zinc-100">
        {recent.map((log) => (
          <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-zinc-50 border border-zinc-200 shrink-0 mt-0.5">
                {getActionIcon(log.action)}
              </div>
              <div>
                <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                  {log.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-zinc-300">·</span>
                  <RoleBadge role={log.actorRole === 'System' ? 'Viewer' : log.actorRole} size="sm" />
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase text-zinc-400 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-100 shrink-0">
              {log.action.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
