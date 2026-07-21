'use client';

import React from 'react';
import { ToastMessage } from '@/types/post';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-fade-in ${
            toast.type === 'success'
              ? 'bg-[#16181C]/90 border-sky-500/40 text-white shadow-sky-500/10'
              : toast.type === 'error'
              ? 'bg-[#16181C]/90 border-rose-500/40 text-white shadow-rose-500/10'
              : 'bg-[#16181C]/90 border-border text-text-muted shadow-black/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </div>

          <button
            onClick={() => onClose(toast.id)}
            className="text-text-muted hover:text-white p-1 rounded-lg transition-colors shrink-0"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
