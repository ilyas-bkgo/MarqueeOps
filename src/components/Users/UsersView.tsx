import React, { useState, useMemo } from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { AppUser, Role, UserStatus, UserPlan } from '../../types';
import { RoleBadge, StatusBadge, PlanBadge } from '../Common/RBACBadge';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { UserDetailDrawer } from './UserDetailDrawer';
import {
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  MoreVertical,
  Shield,
  ShieldAlert,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  UserCheck,
  Lock,
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const {
    users,
    currentUser,
    updateUserRole,
    updateUserStatus,
    isLoading,
  } = usePulseBoard();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);
  const [drawerUser, setDrawerUser] = useState<AppUser | null>(null);

  // RBAC privileges
  const isSuperAdmin = currentUser.role === 'Super Admin';
  const isAdmin = currentUser.role === 'Admin';
  const isViewer = currentUser.role === 'Viewer';
  const canManage = isSuperAdmin || isAdmin;

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchesSegment = segmentFilter === 'ALL' || u.department === segmentFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesSegment;
    });
  }, [users, searchTerm, roleFilter, statusFilter, segmentFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Access Notice */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-800">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900">Agency Team Directory</h2>
              <span className="text-xs text-zinc-500 font-mono">({users.length} total)</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isSuperAdmin && 'You can manage workspace roles, access, and team invitations.'}
              {isAdmin && 'You can manage team members and workspace access. Role changes are restricted.'}
              {isViewer && 'You have read-only visibility into the agency workspace.'}
            </p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Teammate</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teammates by name, email, or focus area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[11px] text-zinc-400 font-mono">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[11px] text-zinc-400 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Segment Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[11px] text-zinc-400 font-mono">Segment:</span>
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Segments</option>
              <option value="Fintech">Fintech</option>
              <option value="Developer Tools">Developer Tools</option>
              <option value="Enterprise SaaS">Enterprise SaaS</option>
              <option value="HealthTech">HealthTech</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Security & Infra">Security & Infra</option>
            </select>
          </div>

          {(searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' || segmentFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
                setSegmentFilter('ALL');
              }}
              className="text-xs text-zinc-500 hover:text-zinc-900 underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4">Segment & Plan</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <p className="text-sm font-medium">No accounts match the selected criteria.</p>
                    <p className="text-xs text-zinc-400 mt-1">Try relaxing search terms or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-50/80 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setDrawerUser(user)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center shrink-0 border border-zinc-200">
                            {user.avatar || user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900 hover:text-indigo-600 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-zinc-600 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role with Super Admin inline upgrade capability */}
                      <td className="py-3 px-4">
                        {isSuperAdmin ? (
                          <div className="inline-flex items-center">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                              className="text-xs font-medium py-1 px-2.5 rounded-md border border-zinc-300 bg-white hover:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                              title="Click to update role directly (Super Admin authorized)"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Admin">Admin</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5" title="Only Super Admin can change roles">
                            <RoleBadge role={user.role} size="sm" />
                            {!isViewer && (
                              <Lock className="w-3 h-3 text-zinc-300" />
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={user.status} size="sm" />
                      </td>

                      {/* Segment & Plan */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="font-medium text-zinc-800 block text-xs">{user.department}</span>
                          <PlanBadge plan={user.plan} />
                        </div>
                      </td>

                      {/* Date Joined */}
                      <td className="py-3 px-4 font-mono text-zinc-700 text-[11px]">
                        <div>{user.createdAt}</div>
                        <div className="text-[10px] text-zinc-600">Active: {user.lastActive}</div>
                      </td>

                      {/* Actions Column (RBAC Aware) */}
                      <td className="py-3 px-4 text-right">
                        {isViewer ? (
                          <span className="text-[11px] text-zinc-600 font-mono px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded">
                            Read Only
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                              title="Edit user details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingUser(user)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination / stats */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-800">{filteredUsers.length}</strong> of{' '}
            <strong className="text-zinc-800">{users.length}</strong> registered accounts
          </span>
          <span className="font-mono text-[11px]">MarqueeOps access policy active</span>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />

      <DeleteUserModal
        user={deletingUser}
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
      />

      <UserDetailDrawer
        user={drawerUser}
        isOpen={!!drawerUser}
        onClose={() => setDrawerUser(null)}
        onEdit={(u) => setEditingUser(u)}
        canEdit={canManage}
      />
    </div>
  );
};
