'use client';

import React from 'react';
import { Home, Waves, PenSquare, ShieldCheck, LogOut, Lock } from 'lucide-react';

interface LeftSidebarProps {
  onScrollToTop?: () => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onScrollToTop,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
}) => {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col justify-between h-screen sticky top-0 py-6 px-5 bg-white border-r border-gray-100 select-none">
      <div className="space-y-8">
        {/* Ripple Brand Logo */}
        <div className="flex items-center gap-3 px-2 cursor-pointer group" onClick={onScrollToTop}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300 shrink-0">
            <Waves className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 block leading-tight">
              Ripple
            </span>
            <span className="text-[11px] text-gray-400 font-medium block">
              by <span className="font-semibold text-gray-500">Subhra Biswas</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          <button
            onClick={onScrollToTop}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-[15px] bg-primary/5 text-gray-900 border border-primary/10 transition-all duration-200 hover:bg-primary/10"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <span>Home</span>
          </button>

          {!isAdmin ? (
            <button
              onClick={onOpenAdminModal}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-[15px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <span>Admin Login</span>
            </button>
          ) : (
            <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 block">Admin Active</span>
                    <span className="text-[10px] text-emerald-600 font-medium">SUBHRA</span>
                  </div>
                </div>
                <button
                  onClick={onLogoutAdmin}
                  className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Quick Compose */}
      <div className="pt-4">
        <button
          onClick={onScrollToTop}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-600 text-white font-bold text-[15px] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
        >
          <PenSquare className="w-5 h-5" />
          <span>Post</span>
        </button>
      </div>
    </aside>
  );
};
