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
    <aside className="w-full lg:w-64 shrink-0 flex flex-col justify-between h-full py-4 px-2 sm:px-4 border-r border-border bg-white select-none">
      <div className="space-y-6">
        {/* Ripple Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer group" onClick={onScrollToTop}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div className="hidden sm:block min-w-0">
            <span className="text-xl font-bold tracking-tight text-gray-900 block leading-tight">
              Ripple
            </span>
            <span className="text-xs text-gray-500 font-medium block truncate">
              by <span className="font-semibold text-gray-700">Subhra Biswas</span>
            </span>
          </div>
        </div>

        {/* Navigation Link */}
        <nav className="space-y-1">
          <button
            onClick={onScrollToTop}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-full font-bold text-base bg-black/5 text-text-main transition-all duration-200"
          >
            <Home className="w-6 h-6 text-primary" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Admin Mode Status / Login Trigger */}
          {!isAdmin ? (
            <button
              onClick={onOpenAdminModal}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-full font-medium text-base text-text-muted hover:bg-gray-100 hover:text-text-main transition-all duration-200"
            >
              <Lock className="w-5 h-5 text-text-muted" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          ) : (
            <div className="pt-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="flex items-center gap-2 text-xs font-bold truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline truncate">Admin (SUBHRA)</span>
                </div>
                <button
                  onClick={onLogoutAdmin}
                  className="p-1 rounded-lg hover:bg-emerald-200/60 text-emerald-800 transition-colors shrink-0"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Quick Compose Button */}
      <div className="pt-4 hidden sm:block">
        <button
          onClick={onScrollToTop}
          className="w-full py-3 px-6 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-md shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <PenSquare className="w-5 h-5" />
          <span>Post</span>
        </button>
      </div>
    </aside>
  );
};
