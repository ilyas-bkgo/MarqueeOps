import React, { useState, useEffect } from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { AppUser, Role, UserPlan, UserStatus } from '../../types';
import { Modal } from '../Common/Modal';
import { Save, Lock, Shield } from 'lucide-react';

interface EditUserModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose }) => {
  const { currentUser, updateUser, updateUserRole } = usePulseBoard();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Viewer');
  const [department, setDepartment] = useState('Fintech');
  const [plan, setPlan] = useState<UserPlan>('Pro');
  const [status, setStatus] = useState<UserStatus>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setDepartment(user.department);
      setPlan(user.plan);
      setStatus(user.status);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Update generic details
    const success = await updateUser(user.id, {
      name,
      email,
      department,
      plan,
      status,
      role: currentUser.role === 'Super Admin' ? role : user.role,
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const isSuperAdmin = currentUser.role === 'Super Admin';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Account: ${user.name}`}
      subtitle="Update identity metadata, subscription tier, and access credentials"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Corporate Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Segment</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="Fintech">Fintech</option>
              <option value="Developer Tools">Developer Tools</option>
              <option value="Enterprise SaaS">Enterprise SaaS</option>
              <option value="HealthTech">HealthTech</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Security & Infra">Security & Infra</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Plan Tier</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as UserPlan)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="Enterprise">Enterprise</option>
              <option value="Pro">Pro</option>
              <option value="Starter">Starter</option>
              <option value="Free">Free</option>
            </select>
          </div>
        </div>

        {/* RBAC ROLE ASSIGNMENT */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-zinc-700" />
              RBAC Role Assignment
            </label>
            {!isSuperAdmin && (
              <span className="text-[10px] text-amber-700 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked (Requires Super Admin)
              </span>
            )}
          </div>

          <select
            value={isSuperAdmin ? role : user.role}
            disabled={!isSuperAdmin}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            <option value="Super Admin">Super Admin (Full Root System Access)</option>
            <option value="Admin">Admin (User & Audit Management)</option>
            <option value="Viewer">Viewer (Read-Only Observation)</option>
          </select>
          {!isSuperAdmin && (
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
              As an Admin or Viewer, role modification is disabled. Switch to Super Admin in the
              header to edit user permissions.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Lifecycle Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
