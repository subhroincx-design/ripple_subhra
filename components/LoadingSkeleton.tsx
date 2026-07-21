'use client';

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full divide-y divide-gray-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full animate-shimmer shrink-0" />
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-4 w-24 rounded-full animate-shimmer" />
                <div className="h-3 w-12 rounded-full animate-shimmer" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded-lg animate-shimmer" />
                <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
              </div>
              <div className="flex items-center gap-4 pt-1">
                <div className="h-8 w-16 rounded-full animate-shimmer" />
                <div className="h-8 w-16 rounded-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
