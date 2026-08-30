'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Unable to retrieve data.',
  message = 'Check backend API connection or service availability.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-red-500/10 border border-red-500/30 my-4 select-none">
      <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-red-300 max-w-md leading-relaxed mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-mono font-bold transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>RETRY CONNECTION</span>
        </button>
      )}
    </div>
  );
}
