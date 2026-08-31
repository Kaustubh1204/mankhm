'use client';

import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  height?: string;
}

export default function LoadingSkeleton({ rows = 3, height = 'h-16' }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3 w-full animate-pulse my-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className={`w-full ${height} rounded-2xl bg-[#091024]/80 border border-slate-800/80`}
        />
      ))}
    </div>
  );
}
