'use client';

import React from 'react';
import { Compass, Satellite, Cpu } from 'lucide-react';

export default function HeroHUD() {
  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full flex flex-col justify-between p-4 md:p-6 text-slate-300 font-mono text-xs select-none z-10">
      {/* Top HUD Row - Minimalist Floating Badge */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141e36]/70 border border-cyan-500/20 backdrop-blur-md text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-cyan-300 font-semibold tracking-wider">SATELLITE STREAM</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">0.1° SPATIAL</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141e36]/70 border border-slate-700/50 backdrop-blur-md text-slate-300 text-[11px]">
          <Compass className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
          <span>GRID: 0° N / SATELLITE RADAR</span>
        </div>
      </div>

      {/* Center Faint GIS Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-cyan-500/10 pointer-events-none flex items-center justify-center">
        <div className="w-full h-[1px] bg-cyan-500/10 absolute" />
        <div className="h-full w-[1px] bg-cyan-500/10 absolute" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[9px] text-cyan-400/30">N</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[9px] text-cyan-400/30">S</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-[9px] text-cyan-400/30">W</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[9px] text-cyan-400/30">E</div>
      </div>

      {/* Bottom Minimalist Technical Badges */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-4 text-[10px]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141e36]/70 border border-cyan-500/20 backdrop-blur-md text-slate-300">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>AI ATMOSPHERIC MODEL ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141e36]/70 border border-slate-700/50 backdrop-blur-md text-slate-300">
          <Satellite className="h-3.5 w-3.5 text-blue-400" />
          <span>MULTISPECTRAL INFRARED</span>
        </div>
      </div>
    </div>
  );
}
