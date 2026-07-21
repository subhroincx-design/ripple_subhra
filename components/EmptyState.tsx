'use client';

import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface EmptyStateProps {
  onFocusCreate?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onFocusCreate }) => {
  return (
    <div className="py-16 px-6 text-center bg-gray-50/50 rounded-2xl my-6 border border-border space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
        <MessageSquarePlus className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-main">No posts yet</h3>
        <p className="text-sm text-text-muted">
          Be the first to share a thought! Enter your name and post a message.
        </p>
      </div>

      <button
        onClick={onFocusCreate}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm"
      >
        <span>Create first post</span>
      </button>
    </div>
  );
};
