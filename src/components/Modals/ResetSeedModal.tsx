import React, { useState } from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { Modal } from '../Common/Modal';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetSeedModal: React.FC<ResetSeedModalProps> = ({ isOpen, onClose }) => {
  const { resetSeedData } = usePulseBoard();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await resetSeedData();
    setIsResetting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Demo Seed Data"
      subtitle="Re-initialize the SaaS database to the pristine benchmark dataset"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            This will restore 20 standard SaaS accounts, 12+ chronological audit events, standard
            revenue telemetry, and regenerate AI executive insight cards.
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Restoring...' : 'Restore Seed Dataset'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
