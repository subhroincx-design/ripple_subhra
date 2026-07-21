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
    <div className="fixed bottom-20 sm:bottom-5 right-0 left-0 sm:left-auto sm:right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 mx-auto sm:mx-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-fade-in ${
            toast.type === 'success'
              ? 'bg-gray-900/95 border-gray-800 text-white shadow-gray-950/20'
              : toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-800 text-white shadow-rose-950/20'
              : 'bg-gray-900/95 border-gray-800 text-white shadow-black/30'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-xs font-semibold text-white leading-tight truncate">
              {toast.message}
            </span>
          </div>

          <button
            onClick={() => onClose(toast.id)}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
