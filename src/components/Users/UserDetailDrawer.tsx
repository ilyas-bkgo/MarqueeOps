import React from 'react';
import { AppUser } from '../../types';
import { RoleBadge, StatusBadge, PlanBadge } from '../Common/RBACBadge';
import { X, Mail, Shield, Calendar, Building2, CheckCircle2, Clock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserDetailDrawerProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: AppUser) => void;
  canEdit?: boolean;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  canEdit = true,
}) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/30 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-zinc-200 z-10 flex flex-col justify-between"
          >
            {/* Header */}
            <div>
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-sm flex items-center justify-center border border-zinc-300">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">{user.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div>
                    <span className="text-[10px] text-zinc-600 font-mono block uppercase">Role</span>
                    <div className="mt-1">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-600 font-mono block uppercase">Status</span>
                    <div className="mt-1">
                      <StatusBadge status={user.status} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-zinc-600" /> Segment
                    </span>
                    <span className="font-semibold text-zinc-900">{user.department}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-zinc-600" /> Plan Subscription
                    </span>
                    <PlanBadge plan={user.plan} />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" /> Member Since
                    </span>
                    <span className="font-mono text-zinc-700">{user.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" /> Last Active
                    </span>
                    <span className="font-mono text-zinc-700">{user.lastActive}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-zinc-600" /> MFA Enforced
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Key
                    </span>
                  </div>
                </div>

                {/* Scope capabilities */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
                  <div className="font-semibold text-zinc-900 mb-1">Effective Permissions</div>
                  <ul className="text-zinc-600 text-[11px] space-y-1 list-disc list-inside">
                    {user.role === 'Super Admin' && (
                      <>
                        <li>Modify organization permissions & RBAC roles</li>
                        <li>Delete and invite workspace members</li>
                        <li>Configure API security keys and webhooks</li>
                      </>
                    )}
                    {user.role === 'Admin' && (
                      <>
                        <li>Manage user invitations & activation states</li>
                        <li>Inspect audit logs and export telemetry</li>
                        <li>Cannot elevate other users to Admin roles</li>
                      </>
                    )}
                    {user.role === 'Viewer' && (
                      <>
                        <li>Read-only view across metrics and audit logs</li>
                        <li>No authorization to change configuration</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            {canEdit && onEdit && (
              <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-200 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(user);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 shadow-xs"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
