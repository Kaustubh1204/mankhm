'use client';

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  statusColor?: 'cyan' | 'blue' | 'teal' | 'amber' | 'red';
}

export default function MetricCard({
  label,
  value,
  unit,
  subtitle,
  icon: Icon,
  statusColor = 'cyan',
}: MetricCardProps) {
  const colorStyles = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    teal: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    red: 'border-red-500/30 text-red-400 bg-red-500/10',
  }[statusColor];

  const displayVal = value !== null && value !== undefined && value !== '' ? value : '--';

  return (
    <div
      data-card
      className="p-6 rounded-2xl bg-[#091024]/90 border border-slate-800 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorStyles}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {displayVal}
          </span>
          {unit && displayVal !== '--' && (
            <span className="text-xs font-mono text-slate-400">{unit}</span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
