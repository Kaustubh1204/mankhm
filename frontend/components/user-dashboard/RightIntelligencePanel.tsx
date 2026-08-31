'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import {
  Cpu,
  Zap,
  ShieldAlert,
  Bell,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Wind,
  CloudRain,
  Waves,
} from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';

interface RightIntelligencePanelProps {
  className?: string;
}

export default function RightIntelligencePanel({ className = '' }: RightIntelligencePanelProps) {
  const { currentForecast, currentRiskRegions, currentAlerts, selectedCyclone } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const primaryRisk = currentRiskRegions[0] || null;

  return (
    <div
      className={`rounded-3xl bg-[#091126]/90 border border-slate-800/80 shadow-2xl backdrop-blur-2xl p-4 text-xs font-mono select-none pointer-events-auto transition-all w-80 sm:w-96 max-h-[calc(100vh-180px)] flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider text-xs">AI CYCLONE INTELLIGENCE</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
            DEMO MODEL OUTPUT
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Internal Scroll Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto space-y-4 pt-3 pr-1 custom-scrollbar">
          {/* Section 1: AI Model Confidence & RI Risk */}
          <div className="p-3.5 rounded-2xl bg-[#060b19]/90 border border-cyan-500/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Neural Model Metrics</span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {currentForecast?.trackConfidencePct || 87}% Convergence
              </span>
            </div>

            {/* RI Risk Dedicated Visual Indicator */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                  <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span>RAPID INTENSIFICATION (RI) RISK</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/50">
                  {currentForecast?.rapidIntensificationRisk || 'ELEVATED'} ({currentForecast?.rapidIntensificationProbPct || 74}%)
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentForecast?.rapidIntensificationProbPct || 74}%` }}
                />
              </div>

              <p className="text-[9px] text-slate-300 leading-tight">
                Model detects high probability of central pressure drop &gt; 24 hPa in 24h prior to landfall.
              </p>
            </div>

            {/* AI Summary Narrative Box */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Model Consensus Summary:</span>
              <p className="text-[10px] text-slate-200 leading-relaxed italic bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                &quot;{currentForecast?.aiSummary || 'Model analysis indicates continued strengthening during the next 12 hours.'}&quot;
              </p>
            </div>
          </div>

          {/* Section 2: Regional Risk Assessment */}
          <div className="p-3.5 rounded-2xl bg-[#060b19]/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-red-400" /> REGIONAL RISK
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                HIGH HAZARD
              </span>
            </div>

            {primaryRisk && (
              <div className="space-y-2 text-[10px]">
                <div className="font-bold text-white text-[11px] truncate">{primaryRisk.regionName}</div>

                {/* Risk Breakdown Rows */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Wind className="h-3 w-3 text-cyan-400" /> Wind Risk
                    </span>
                    <span className="text-cyan-300 font-bold">{primaryRisk.windRiskScore}/100 (High)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <CloudRain className="h-3 w-3 text-blue-400" /> Rainfall Exposure
                    </span>
                    <span className="text-blue-300 font-bold">{primaryRisk.rainfallRiskScore}/100 (Moderate)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Waves className="h-3 w-3 text-teal-400" /> Storm Surge Peak
                    </span>
                    <span className="text-teal-300 font-bold">{primaryRisk.stormSurgeMeters}m (Elevated)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800">
              <Link
                href="/user/risk-map"
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>OPEN RISK MAP</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Section 3: Active Alerts Feed */}
          <div className="p-3.5 rounded-2xl bg-[#060b19]/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-amber-400" /> ACTIVE ALERTS
              </span>
              <span className="text-[9px] text-cyan-400 font-bold">{currentAlerts.length} Active</span>
            </div>

            <div className="space-y-1.5">
              {currentAlerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  className="p-2 rounded-xl bg-[#040814] border border-slate-800/80 space-y-1 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white truncate max-w-[190px]">{alt.title}</span>
                    <StatusBadge status={alt.severity} size="sm" />
                  </div>
                  <p className="text-[9px] text-slate-400 line-clamp-1">{alt.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <Link
                href="/user/alerts"
                className="w-full py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>VIEW ALL ALERTS ({currentAlerts.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
