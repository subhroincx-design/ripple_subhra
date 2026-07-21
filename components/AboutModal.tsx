'use client';

import React from 'react';
import { X, ShieldCheck, Zap, Heart, Lock, Globe } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-white">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">About Pulse</h2>
            <p className="text-xs text-text-muted">Anonymous Microblogging Platform</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 text-sm text-text-muted leading-relaxed mb-6">
          <p>
            Pulse is a lightweight, high-performance microblogging space created for instant sharing without authentication barriers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Zero Login</h4>
                <p className="text-[11px] text-text-muted">No emails, passwords, or signup forms required.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Realtime Feed</h4>
                <p className="text-[11px] text-text-muted">Posts appear instantly across all live sessions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Admin Deletion</h4>
                <p className="text-[11px] text-text-muted">Deletion triggers require secret URL parameter authorization.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Community Likes</h4>
                <p className="text-[11px] text-text-muted">Optimistic heart counter for instant engagement.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex justify-end pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-lg shadow-primary/20"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
};
