import React from 'react';
import { ActivityLog } from '../../types';
import { Modal } from '../Common/Modal';
import { RoleBadge } from '../Common/RBACBadge';
import { Shield, Clock, Terminal, User, FileText } from 'lucide-react';

interface ActivityDetailModalProps {
  activity: ActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  if (!activity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Event Details"
      subtitle={`Event ID: ${activity.id}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Core summary */}
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-zinc-700" /> Action
            </span>
            <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-zinc-900 text-white">
              {activity.action}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Actor
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">{activity.actorName}</span>
              <RoleBadge role={activity.actorRole === 'System' ? 'Viewer' : activity.actorRole} size="sm" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" /> Timestamp
            </span>
            <span className="font-mono text-zinc-700">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <label className="block font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-500" /> Compliance Description
          </label>
          <div className="p-3 bg-white border border-zinc-200 rounded-lg text-zinc-800 leading-relaxed font-mono text-[11px]">
            {activity.description}
          </div>
        </div>

        {/* JSON Metadata Payload */}
        <div>
          <label className="block font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" /> Raw Metadata Payload
          </label>
          <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-lg overflow-x-auto font-mono text-[11px] border border-zinc-800 leading-relaxed">
            {JSON.stringify(activity.metadata || { recordedAt: activity.timestamp, event: activity.action }, null, 2)}
          </pre>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </Modal>
  );
};
