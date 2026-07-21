'use client';

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-0 divide-y divide-border">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 bg-white animate-pulse flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-28 bg-gray-200 rounded-md" />
              <div className="h-3 w-12 bg-gray-100 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded-md" />
              <div className="h-4 w-3/4 bg-gray-100 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
