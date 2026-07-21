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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 px-6 py-2 pb-safe flex items-center justify-around select-none">
      {/* Home */}
      <button
        onClick={onScrollToTop}
        className="flex flex-col items-center gap-0.5 text-primary active:scale-90 transition-transform py-1.5"
        aria-label="Home"
      >
        <Home className="w-[22px] h-[22px]" />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      {/* Floating Compose */}
      <button
        onClick={onScrollToTop}
        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center transform -translate-y-3 active:scale-90 transition-all duration-200"
        aria-label="Create Post"
      >
        <PenSquare className="w-5 h-5" />
      </button>

      {/* Admin */}
      {!isAdmin ? (
        <button
          onClick={onOpenAdminModal}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform py-1.5"
          aria-label="Admin Login"
        >
          <Lock className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-bold">Admin</span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-0.5 text-emerald-600 py-1.5">
          <ShieldCheck className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-extrabold">SUBHRA</span>
        </div>
      )}
    </div>
  );
};
