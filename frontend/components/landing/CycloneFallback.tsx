'use client';

import React from 'react';

interface CycloneFallbackProps {
  className?: string;
  isMissingModel?: boolean;
}

export default function CycloneFallback({ className = '', isMissingModel = true }: CycloneFallbackProps) {
  return (
    <div className={`relative w-full h-full min-h-[460px] flex flex-col items-center justify-center ${className}`}>
      
      {/* 3D Cyclone Asset Required Overlay Banner */}
      {isMissingModel && (
        <div className="z-30 px-6 py-4 rounded-xl bg-[#141e36]/90 border border-cyan-500/40 text-cyan-300 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>3D CYCLONE ASSET REQUIRED</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Please place a 3D cyclone model file at: <br />
            <code className="text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">/public/models/cyclone.glb</code>
          </p>
        </div>
      )}

    </div>
  );
}
