'use client';

import React from 'react';
import { Home, PenSquare, Lock, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  onScrollToTop: () => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onScrollToTop,
  isAdmin,
  onOpenAdminModal,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-6 py-2 pb-safe flex items-center justify-around shadow-lg select-none">
      {/* Home Button */}
      <button
        onClick={onScrollToTop}
        className="flex flex-col items-center gap-1 text-primary active:scale-95 transition-transform py-1"
        aria-label="Home"
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      {/* Floating Quick Compose Button */}
      <button
        onClick={onScrollToTop}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 flex items-center justify-center transform -translate-y-2 active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <PenSquare className="w-5 h-5" />
      </button>

      {/* Admin Button */}
      {!isAdmin ? (
        <button
          onClick={onOpenAdminModal}
          className="flex flex-col items-center gap-1 text-text-muted hover:text-text-main active:scale-95 transition-transform py-1"
          aria-label="Admin Login"
        >
          <Lock className="w-6 h-6" />
          <span className="text-[10px] font-bold">Admin</span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1 text-emerald-700 py-1">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span className="text-[10px] font-extrabold">SUBHRA</span>
        </div>
      )}
    </div>
  );
};
