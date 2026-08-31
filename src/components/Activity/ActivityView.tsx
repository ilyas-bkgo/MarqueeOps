import React, { useState, useMemo } from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { ActivityLog } from '../../types';
import { RoleBadge } from '../Common/RBACBadge';
import { ActivityDetailModal } from './ActivityDetailModal';
import {
  Activity,
  Search,
  Filter,
  Download,
  ShieldAlert,
  UserCheck,
  UserMinus,
  Sparkles,
  Key,
  Settings,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { activities, addToast } = usePulseBoard();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'ROLE_CHANGES' | 'USER_ACTIONS' | 'SECURITY' | 'INSIGHTS'>('ALL');
  const [actorRoleFilter, setActorRoleFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);

  const getActionIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'ROLE_CHANGED':
        return <ShieldAlert className="w-4 h-4 text-violet-600" />;
      case 'USER_INVITED':
      case 'USER_CREATED':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'USER_DELETED':
        return <UserMinus className="w-4 h-4 text-rose-600" />;
      case 'MFA_UPDATED':
      case 'SECURITY_ALERT':
        return <Key className="w-4 h-4 text-amber-600" />;
      case 'INSIGHTS_GENERATED':
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      default:
        return <Settings className="w-4 h-4 text-zinc-600" />;
    }
  };

  const getSeverityPill = (severity: ActivityLog['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            INFO
          </span>
        );
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Search
      const matchesSearch =
        act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.action.toLowerCase().includes(searchTerm.toLowerCase());

      // Category tab
      let matchesCategory = true;
      if (categoryFilter === 'ROLE_CHANGES') {
        matchesCategory = act.action === 'ROLE_CHANGED';
      } else if (categoryFilter === 'USER_ACTIONS') {
        matchesCategory = ['USER_CREATED', 'USER_INVITED', 'USER_UPDATED', 'USER_DELETED', 'USER_STATUS_CHANGED'].includes(act.action);
      } else if (categoryFilter === 'SECURITY') {
        matchesCategory = ['MFA_UPDATED', 'SECURITY_ALERT', 'API_KEY_ROTATED'].includes(act.action);
      } else if (categoryFilter === 'INSIGHTS') {
        matchesCategory = act.action === 'INSIGHTS_GENERATED';
      }

      // Actor role
      const matchesActor = actorRoleFilter === 'ALL' || act.actorRole === actorRoleFilter;

      // Severity
      const matchesSeverity = severityFilter === 'ALL' || act.severity === severityFilter;

      return matchesSearch && matchesCategory && matchesActor && matchesSeverity;
    });
  }, [activities, searchTerm, categoryFilter, actorRoleFilter, severityFilter]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,Actor,Role,Action,Description,Severity\n' +
      filteredActivities
        .map(
          (a) =>
            `"${a.id}","${a.timestamp}","${a.actorName}","${a.actorRole}","${a.action}","${a.description.replace(/"/g, '""')}","${a.severity}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `marqueeops-activity-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Audit Trail Exported', `Exported ${filteredActivities.length} log events to CSV`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900">Workspace Activity Log</h2>
              <span className="text-xs text-zinc-500 font-mono">({activities.length} entries)</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              A searchable record of access changes, account activity, and portfolio intelligence updates
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 pb-2">
          {(
            [
              { id: 'ALL', label: 'All Events', count: activities.length },
              {
                id: 'ROLE_CHANGES',
                label: 'Role Modifications',
                count: activities.filter((a) => a.action === 'ROLE_CHANGED').length,
              },
              {
                id: 'USER_ACTIONS',
                label: 'User Lifecycle',
                count: activities.filter((a) =>
                  ['USER_CREATED', 'USER_INVITED', 'USER_UPDATED', 'USER_DELETED', 'USER_STATUS_CHANGED'].includes(a.action)
                ).length,
              },
              {
                id: 'SECURITY',
                label: 'Security & Auth',
                count: activities.filter((a) => ['MFA_UPDATED', 'SECURITY_ALERT', 'API_KEY_ROTATED'].includes(a.action)).length,
              },
              {
                id: 'INSIGHTS',
                label: 'AI Syntheses',
                count: activities.filter((a) => a.action === 'INSIGHTS_GENERATED').length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                categoryFilter === tab.id
                  ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  categoryFilter === tab.id ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit descriptions, actors, or actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Actor Role Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-[11px] text-zinc-400 font-mono">Actor Role:</span>
              <select
                value={actorRoleFilter}
                onChange={(e) => setActorRoleFilter(e.target.value)}
                className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Viewer">Viewer</option>
                <option value="System">System</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-[11px] text-zinc-400 font-mono">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {(searchTerm || categoryFilter !== 'ALL' || actorRoleFilter !== 'ALL' || severityFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('ALL');
                  setActorRoleFilter('ALL');
                  setSeverityFilter('ALL');
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900 underline px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p className="text-sm font-medium">No activity records match the selected filter.</p>
            <p className="text-xs text-zinc-400 mt-1">Clear filters to view the complete compliance history.</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="p-4 hover:bg-zinc-50/80 transition-colors flex items-start justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 shrink-0 mt-0.5 group-hover:border-zinc-300 transition-colors">
                  {getActionIcon(act.action)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      {act.action}
                    </span>
                    {getSeverityPill(act.severity)}
                  </div>

                  <p className="text-xs text-zinc-800 font-medium leading-relaxed mt-1">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-0.5 font-mono">
                    <span className="text-zinc-800 font-sans font-semibold flex items-center gap-1.5">
                      <span>{act.actorName}</span>
                      <RoleBadge role={act.actorRole === 'System' ? 'Viewer' : act.actorRole} size="sm" />
                    </span>
                    <span>·</span>
                    <span>{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                className="text-zinc-400 group-hover:text-zinc-800 p-1 rounded transition-colors shrink-0"
                title="Inspect audit payload"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))
        )}

        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-800">{filteredActivities.length}</strong> events in current view
          </span>
          <span className="font-mono text-[11px]">Audit Retention: 365 Days</span>
        </div>
      </div>

      {/* Activity Detail Inspector Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
