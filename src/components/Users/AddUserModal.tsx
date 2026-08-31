import React, { useState } from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { Role, UserPlan, UserStatus } from '../../types';
import { Modal } from '../Common/Modal';
import { Shield, UserPlus, Info } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createUser } = usePulseBoard();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Viewer');
  const [department, setDepartment] = useState('Fintech');
  const [plan, setPlan] = useState<UserPlan>('Pro');
  const [status, setStatus] = useState<UserStatus>('invited');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const success = await createUser({
      name,
      email,
      role: currentUser.role === 'Super Admin' ? role : 'Viewer',
      department,
      plan,
      status,
    });
    setIsSubmitting(false);

    if (success) {
      setName('');
      setEmail('');
      setRole('Viewer');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite New User"
      subtitle="Send platform access credentials and configure initial workspace role"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan Rivera"
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Corporate Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jordan.rivera@enterprise.com"
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Industry Segment
            </label>
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
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Account Tier / Plan
            </label>
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

        {/* RBAC Role Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-zinc-700">
              Assigned Role
            </label>
            {currentUser.role !== 'Super Admin' && (
              <span className="text-[10px] text-amber-700 flex items-center gap-1 font-mono">
                <Info className="w-3 h-3" /> Super Admin needed for Admin assignment
              </span>
            )}
          </div>

          <select
            value={currentUser.role === 'Super Admin' ? role : 'Viewer'}
            disabled={currentUser.role !== 'Super Admin'}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            <option value="Viewer">Viewer (Read-only observer)</option>
            <option value="Admin">Admin (Account manager)</option>
            <option value="Super Admin">Super Admin (Full root access)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Initial Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="invited">Send Invitation Link (Invited)</option>
            <option value="active">Instant Activation (Active)</option>
            <option value="suspended">Suspended Pending Review</option>
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
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Inviting...' : 'Invite User'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
