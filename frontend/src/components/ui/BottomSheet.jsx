import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="relative z-[101] bg-[hsl(var(--surface))] flex flex-col shadow-2xl overflow-hidden
                       rounded-t-3xl border-t border-[hsl(var(--border))] w-full max-h-[90vh] pointer-events-auto
                       md:w-[460px] md:rounded-2xl md:border md:max-h-[85vh]"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-[hsl(var(--text-tertiary))] opacity-50" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-6 pb-4 border-b border-[hsl(var(--border))]">
                <h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">{title}</h2>
              </div>
            )}

            {/* Content Area */}
            <div className="px-6 py-4 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+24px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
