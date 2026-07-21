'use client';

import React from 'react';
import { Waves, PenSquare } from 'lucide-react';

interface EmptyStateProps {
  onFocusCreate?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onFocusCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center animate-fade-in">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 flex items-center justify-center mb-5 animate-float shadow-lg shadow-blue-100/50">
        <Waves className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
        No ripples yet
      </h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
        Be the first to share a thought. Your post will appear here instantly.
      </p>

      <button
        onClick={onFocusCreate}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:scale-[1.02] active:scale-[0.97] flex items-center gap-2.5"
      >
        <PenSquare className="w-4 h-4" />
        <span>Create First Post</span>
      </button>
    </div>
  );
};
