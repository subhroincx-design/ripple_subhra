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
    <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 py-3 flex items-center justify-between select-none">
      <button onClick={onScrollToTop} className="flex items-center gap-2.5 text-left group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-active:scale-95 transition-transform shrink-0">
          <Waves className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[15px] font-extrabold text-gray-900 leading-tight block tracking-tight">Ripple</span>
          <span className="text-[11px] text-gray-400 font-medium block">
            by <span className="font-semibold text-gray-500">Subhra Biswas</span>
          </span>
        </div>
      </button>

      <div className="flex items-center gap-2 shrink-0">
        {!isAdmin ? (
          <button
            onClick={onOpenAdminModal}
            className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full bg-gray-50 border border-gray-200 active:bg-gray-100 text-gray-600 font-semibold transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUBHRA</span>
            </span>
            <button
              onClick={onLogoutAdmin}
              className="p-2 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
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
