'use client';

import React from 'react';
import { Stats } from '@/types/post';
import { StatsCard } from '@/components/StatsCard';
import { Info, Sparkles, TrendingUp, Hash } from 'lucide-react';

interface RightSidebarProps {
  stats: Stats;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ stats }) => {
  const trendingTopics = [
    { tag: '#NextJS15', category: 'Web Development', posts: '1.4k posts' },
    { tag: '#AnonymousBoard', category: 'Tech & Culture', posts: '950 posts' },
    { tag: '#SupabaseRealtime', category: 'Database', posts: '780 posts' },
    { tag: '#TailwindCSS', category: 'Design System', posts: '2.1k posts' },
  ];

  return (
    <aside className="hidden xl:block w-80 shrink-0 space-y-5 p-4 border-l border-border h-full overflow-y-auto">
      {/* Live Statistics Card */}
      <StatsCard stats={stats} />

      {/* About this project Card */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          About this project
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">
          Pulse is an open microblogging platform designed for frictionless anonymous expression. No login or profile creation required.
        </p>
        <div className="pt-2 flex items-center gap-2 text-[11px] text-primary font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Next.js 15 & Supabase</span>
        </div>
      </div>

      {/* Trending Topics Widget */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Trending Topics
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
            >
              <div>
                <span className="text-[11px] text-text-muted font-medium block">
                  {topic.category}
                </span>
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-text-muted" />
                  {topic.tag.replace('#', '')}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">{topic.posts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer credits */}
      <div className="px-3 text-[11px] text-text-muted space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>Privacy</span>
          <span>•</span>
          <span>Terms</span>
          <span>•</span>
          <span>Cookies</span>
          <span>•</span>
          <span>Status</span>
        </div>
        <p>© 2026 Pulse Anonymous Microblog.</p>
      </div>
    </aside>
  );
};
