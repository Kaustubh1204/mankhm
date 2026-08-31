'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function MapLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#091126]/90 border border-slate-800/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl text-xs font-mono select-none pointer-events-auto max-w-xs transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 text-slate-300 hover:text-white"
      >
        <span className="flex items-center gap-2 font-bold text-[11px] text-cyan-400 uppercase tracking-wider">
          <Info className="h-3.5 w-3.5" />
          <span>Meteorological Legend</span>
        </span>
        {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronUp className="h-3.5 w-3.5 text-slate-400" />}
      </button>

      {isExpanded ? (
        <div className="pt-3 mt-2 border-t border-slate-800 space-y-3 text-[10px]">
          {/* Symbology */}
          <div className="space-y-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Tracks & Vectors</span>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-cyan-400 rounded-full inline-block" /> Observed Track
              </span>
              <span className="text-slate-500">Solid line</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-t border-dashed border-sky-400 inline-block" /> 72h Forecast
              </span>
              <span className="text-slate-500">Dashed line</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-amber-500/20 border border-amber-500/50 rounded inline-block" /> Uncertainty Cone
              </span>
              <span className="text-slate-500">87% Prob</span>
            </div>
          </div>

          {/* Intensity Categories */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <span className="text-slate-500 font-bold uppercase text-[9px] block">IMD Intensity Scale</span>
            <div className="grid grid-cols-2 gap-1.5 text-[9px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-300">Super (&gt;220 km/h)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-slate-300">Extremely Severe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Very Severe (118-165)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-slate-300">Cyclonic Storm</span>
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Coastal Hazard Level</span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">CRITICAL</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">HIGH</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">MODERATE</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">LOW</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Track</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Cone</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Surge</span>
        </div>
      )}
    </div>
  );
}
