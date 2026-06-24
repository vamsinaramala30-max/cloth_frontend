'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastStore } from '@/lib/stores/useToastStore';
import type { ToastType } from '@/types';

const iconMap: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, string> = {
  success: 'border-emerald-400/40 bg-emerald-950/80',
  error: 'border-red-400/40 bg-red-950/80',
  info: 'border-cyan-400/40 bg-cyan-950/80',
  warning: 'border-amber-400/40 bg-amber-950/80',
};

const iconColorMap: Record<ToastType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-cyan-400',
  warning: 'text-amber-400',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border backdrop-blur-2xl px-4 py-3 shadow-2xl ${colorMap[toast.type]}`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
