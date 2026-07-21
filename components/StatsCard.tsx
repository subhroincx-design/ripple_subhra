'use client';

import React from 'react';
import { Stats } from '@/types/post';
import { MessageSquareText, Calendar, Zap } from 'lucide-react';

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Live Statistics
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Posts */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex flex-col justify-between transition-colors hover:border-primary/30">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-1">
            <MessageSquareText className="w-3.5 h-3.5 text-sky-400" />
            <span>Total Posts</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-white animate-scale-in">
            {stats.totalPosts.toLocaleString()}
          </span>
        </div>

        {/* Today's Posts */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex flex-col justify-between transition-colors hover:border-primary/30">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Today's Posts</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-white animate-scale-in">
            {stats.todayPosts.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
