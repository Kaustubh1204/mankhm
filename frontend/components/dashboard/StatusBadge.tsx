'use client';

import React from 'react';

export type StatusVariant =
  | 'ONLINE'
  | 'HEALTHY'
  | 'ACTIVE'
  | 'CRITICAL'
  | 'HIGH'
  | 'WARNING'
  | 'DEGRADED'
  | 'MODERATE'
  | 'LOW'
  | 'OFFLINE'
  | 'FAILED'
  | 'WEAKENING'
  | 'DISSIPATED'
  | 'INFO';

interface StatusBadgeProps {
  status: StatusVariant | string | null | undefined;
  label?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
        --
      </span>
    );
  }

  const s = String(status).toUpperCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  if (['ONLINE', 'HEALTHY', 'ACTIVE'].includes(s)) {
    styles = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  } else if (['CRITICAL', 'FAILED', 'HIGH'].includes(s)) {
    styles = 'bg-red-500/10 text-red-300 border-red-500/40';
  } else if (['WARNING', 'DEGRADED', 'MODERATE', 'WEAKENING'].includes(s)) {
    styles = 'bg-amber-500/10 text-amber-300 border-amber-500/40';
  } else if (['LOW', 'INFO'].includes(s)) {
    styles = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  } else if (['OFFLINE', 'DISSIPATED'].includes(s)) {
    styles = 'bg-slate-800 text-slate-400 border-slate-700';
  }

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-semibold border ${styles} ${sizeStyles}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          ['ONLINE', 'HEALTHY', 'ACTIVE'].includes(s)
            ? 'bg-emerald-400 animate-pulse'
            : ['CRITICAL', 'FAILED'].includes(s)
            ? 'bg-red-400'
            : ['WARNING', 'DEGRADED', 'MODERATE'].includes(s)
            ? 'bg-amber-400'
            : 'bg-slate-400'
        }`}
      />
      <span>{label || s}</span>
    </span>
  );
}
