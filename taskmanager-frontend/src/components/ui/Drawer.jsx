import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Drawer({ open, onClose, title, children, side = 'right', width = 'w-96' }) {
  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const slideFrom = side === 'right'
    ? { x: '100%' }
    : { x: '-100%' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Panel */}
          <motion.div
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute top-0 bottom-0 bg-white dark:bg-slate-800 flex flex-col shadow-premium-lg',
              'border-slate-100 dark:border-slate-700/50',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              width
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
              <button
                onClick={onClose}
                className="btn-ghost p-1.5 rounded-lg"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
