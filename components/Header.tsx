'use client';

import React from 'react';
import { Waves, ShieldCheck, Lock, LogOut } from 'lucide-react';

interface HeaderProps {
  onScrollToTop?: () => void;
  totalPosts: number;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onScrollToTop,
  totalPosts,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
}) => {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between shadow-xs select-none">
      <button onClick={onScrollToTop} className="flex items-center gap-2.5 text-left group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-sm shrink-0">
          <Waves className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-base font-extrabold text-gray-900 leading-tight block">Ripple</span>
          <span className="text-xs text-gray-500 font-medium block truncate">
            by <span className="font-semibold text-gray-700">Subhra Biswas</span>
          </span>
        </div>
      </button>

      <div className="flex items-center gap-2 shrink-0">
        {!isAdmin ? (
          <button
            onClick={onOpenAdminModal}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-100 active:bg-gray-200 text-text-main font-semibold transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUBHRA</span>
            </span>
            <button
              onClick={onLogoutAdmin}
              className="p-1.5 rounded-full text-text-muted hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
