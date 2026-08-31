import React, { useState, useRef, useEffect } from 'react';
import { usePulseBoard } from '../context/PulseBoardContext';
import { Role } from '../types';
import { RoleBadge } from './Common/RBACBadge';
import {
  ChevronDown,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Sparkles,
  RefreshCw,
  Bell,
  Check,
} from 'lucide-react';

interface TopBarProps {
  onOpenAddUserModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAddUserModal }) => {
  const {
    currentUser,
    activeView,
    switchRole,
    refreshInsights,
    isGeneratingInsights,
    activities,
  } = usePulseBoard();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const showRolePreview = false;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: Array<{
    role: Role;
    personaName: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      role: 'Super Admin',
      personaName: 'Elena Rostova',
      description: 'Full privileges: can change user roles & manage accounts',
      icon: <ShieldAlert className="w-4 h-4 text-violet-500" />,
    },
    {
      role: 'Admin',
      personaName: 'Marcus Vance',
      description: 'Account management: cannot elevate user roles',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
    },
    {
      role: 'Viewer',
      personaName: 'Maya Lin',
      description: 'Read-only observer: all destructive buttons disabled',
      icon: <Eye className="w-4 h-4 text-zinc-500" />,
    },
  ];

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Client Operations Command Center',
      subtitle: 'Portfolio health, delivery capacity, and account signals in one workspace',
    },
    users: {
      title: 'Team & Workspace Access',
      subtitle: 'Manage your agency team, account owners, and workspace permissions',
    },
    activity: {
      title: 'Client Operations Activity',
      subtitle: 'A chronological record of account, delivery, and workspace activity',
    },
    insights: {
      title: 'Portfolio Intelligence',
      subtitle: 'Decision-ready account signals synthesized from your agency workspace',
    },
  };

  const currentMeta = viewTitles[activeView] || viewTitles.overview;

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between z-20">
      {/* Left Title */}
      <div>
        <h1 className="text-base font-bold text-zinc-900 leading-none">{currentMeta.title}</h1>
        <p className="text-xs text-zinc-500 mt-1 hidden sm:block">{currentMeta.subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role-Based Quick Action: Invite User (hidden for Viewer) */}
        {currentUser.role !== 'Viewer' && onOpenAddUserModal && activeView === 'users' && (
          <button
            onClick={onOpenAddUserModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <span>+ Invite Teammate</span>
          </button>
        )}

        {/* Refresh AI Insights Action */}
        {(activeView === 'overview' || activeView === 'insights') && (
          <button
            onClick={refreshInsights}
            disabled={isGeneratingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 rounded-lg text-xs font-medium border border-zinc-200 transition-colors disabled:opacity-50"
            title="Re-run AI insight synthesis"
          >
            <Sparkles className={`w-3.5 h-3.5 text-violet-600 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isGeneratingInsights ? 'Synthesizing...' : 'Refresh Insights'}
            </span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg border border-zinc-200 relative transition-colors"
            aria-label="Recent alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl z-30 py-2">
              <div className="px-4 py-2 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900">Recent Audit Alerts</span>
                <span className="text-[10px] text-zinc-600 font-mono">Live Stream</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-3 text-xs hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-zinc-600 font-mono">
                      <span>{act.actorName}</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-zinc-800 mt-1 line-clamp-2 leading-relaxed">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showRolePreview && <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors shadow-2xs"
            aria-label="Switch RBAC preview role"
          >
            <div className="text-left">
              <span className="text-[10px] font-mono text-zinc-600 uppercase block leading-tight font-semibold">
                Workspace role
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900">{currentUser.role}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-0.5" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-xl z-30 p-2">
              <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                <div className="text-xs font-semibold text-zinc-900">Workspace role preview</div>
                <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                  Internal development-only permission preview.
                </div>
              </div>

              <div className="space-y-1">
                {rolesList.map((item) => {
                  const isSelected = currentUser.role === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-colors ${
                        isSelected
                          ? 'bg-zinc-100 border border-zinc-300'
                          : 'hover:bg-zinc-50'
                      }`}
                    >
                      <div className="mt-0.5">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900">{item.role}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                        </div>
                        <span className="text-[11px] text-zinc-700 font-medium block">
                          {item.personaName}
                        </span>
                        <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>}

        {/* Active User Avatar & Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center border border-zinc-300">
            {currentUser.avatar || 'PB'}
          </div>
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-zinc-900 block leading-none">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">
              {currentUser.department}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
