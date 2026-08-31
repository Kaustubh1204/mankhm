'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { ArrowRight, ChevronDown, ChevronUp, Wind, Compass, Gauge, Clock, Navigation, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CurrentCyclonePanelProps {
  className?: string;
}

export default function CurrentCyclonePanel({ className = '' }: CurrentCyclonePanelProps) {
  const { selectedCyclone, cyclones, setSelectedCycloneId } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!selectedCyclone) return null;

  const getTrendIcon = (trend: string) => {
    if (trend === 'STRENGTHENING') return <TrendingUp className="h-3.5 w-3.5 text-red-400" />;
    if (trend === 'WEAKENING') return <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />;
    return <Minus className="h-3.5 w-3.5 text-amber-400" />;
  };

  const getStatusBadge = (status: string, trend: string) => {
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
        {getTrendIcon(trend)}
        <span>{trend || status}</span>
      </span>
    );
  };

  return (
    <div
      className={`rounded-3xl bg-[#091126]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl p-4 text-xs font-mono select-none pointer-events-auto transition-all w-80 sm:w-96 ${className}`}
    >
      {/* Header & Quick Cyclone Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT CYCLONE</span>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            DEMO DATA
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Title & System Switcher */}
      <div className="pt-2.5 space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white tracking-tight">{selectedCyclone.name}</h2>
          {getStatusBadge(selectedCyclone.status, selectedCyclone.intensityTrend)}
        </div>
        <p className="text-[11px] text-cyan-300 font-bold">{selectedCyclone.classification}</p>
        <span className="text-[10px] text-slate-400 block">{selectedCyclone.region} Basin</span>
      </div>

      {/* Compact Metrics Table */}
      {!isCollapsed && (
        <div className="mt-3.5 space-y-2 border-t border-slate-800/80 pt-3">
          <div className="space-y-1.5 text-[11px]">
            {/* Wind Speed */}
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-[#060b19]/80 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-400">
                <Wind className="h-3.5 w-3.5 text-cyan-400" /> Max Sustained Wind
              </span>
              <span className="text-white font-extrabold">
                {selectedCyclone.maxWindKmH} km/h <span className="text-slate-500 font-normal">({selectedCyclone.maxWindKt} kt)</span>
              </span>
            </div>

            {/* Central Pressure */}
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-[#060b19]/80 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-400">
                <Gauge className="h-3.5 w-3.5 text-teal-400" /> Central Pressure
              </span>
              <span className="text-teal-300 font-extrabold">{selectedCyclone.centralPressureHpa} hPa</span>
            </div>

            {/* Movement Vector */}
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-[#060b19]/80 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-400">
                <Compass className="h-3.5 w-3.5 text-blue-400" /> Movement Vector
              </span>
              <span className="text-slate-200 font-bold">
                {selectedCyclone.movementDirection} @ {selectedCyclone.movementSpeedKmH} km/h
              </span>
            </div>

            {/* Coordinates */}
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-[#060b19]/80 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-400">
                <Navigation className="h-3.5 w-3.5 text-cyan-400" /> Position
              </span>
              <span className="text-slate-300 font-mono">
                {selectedCyclone.latitude}°N, {selectedCyclone.longitude}°E
              </span>
            </div>

            {/* Last Observation */}
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-[#060b19]/80 border border-slate-800 text-[10px]">
              <span className="flex items-center gap-2 text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-500" /> Last Observation
              </span>
              <span className="text-slate-400">{selectedCyclone.lastObservation}</span>
            </div>
          </div>

          {/* Quick Cyclone Switcher Pills */}
          {cyclones.length > 1 && (
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">Monitored Systems:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {cyclones.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCycloneId(c.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all border ${
                      c.id === selectedCyclone.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                        : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {c.name.replace('Cyclone ', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Link
              href={`/user/cyclones/${selectedCyclone.id}`}
              className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <span>VIEW FULL DETAILS</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
