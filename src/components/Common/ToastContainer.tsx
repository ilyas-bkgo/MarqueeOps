import React from 'react';
import { usePulseBoard } from '../../context/PulseBoardContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePulseBoard();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const iconMap = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
            info: <Info className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />,
          };

          const borderMap = {
            success: 'border-emerald-200 bg-white/95 text-zinc-900',
            error: 'border-rose-200 bg-white/95 text-zinc-900',
            warning: 'border-amber-200 bg-white/95 text-zinc-900',
            info: 'border-zinc-200 bg-white/95 text-zinc-900',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-lg border shadow-lg backdrop-blur-xs ${borderMap[toast.type]}`}
            >
              <div className="flex items-start gap-2.5">
                {iconMap[toast.type]}
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900">{toast.title}</div>
                  {toast.message && <div className="text-zinc-600 mt-0.5 leading-relaxed">{toast.message}</div>}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors p-0.5 ml-2"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
