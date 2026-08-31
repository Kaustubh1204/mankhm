'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Compass, Layers, MapPin } from 'lucide-react';

interface MapControlsProps {
  onToggleLayers?: () => void;
  className?: string;
}

export default function MapControls({ onToggleLayers, className = '' }: MapControlsProps) {
  const { flyToLocation, selectedCyclone } = useDashboard();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [basinMenuOpen, setBasinMenuOpen] = useState(false);

  const handleZoomIn = () => {
    // Fly to current target with higher zoom
    if (selectedCyclone) {
      flyToLocation([selectedCyclone.latitude, selectedCyclone.longitude], 6.5);
    } else {
      flyToLocation([15.0, 78.0], 6.0);
    }
  };

  const handleZoomOut = () => {
    flyToLocation([15.0, 78.0], 3.8);
  };

  const handleReset = () => {
    flyToLocation([15.0, 78.0], 4.8);
  };

  const handleFocusCyclone = () => {
    if (selectedCyclone) {
      flyToLocation([selectedCyclone.latitude, selectedCyclone.longitude], 6.2);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const basins = [
    { name: 'Bay of Bengal', coords: [16.0, 88.0] as [number, number], zoom: 5.2 },
    { name: 'Arabian Sea', coords: [17.5, 66.0] as [number, number], zoom: 5.2 },
    { name: 'North Indian Ocean', coords: [15.0, 78.0] as [number, number], zoom: 4.8 },
  ];

  return (
    <div className={`flex flex-col gap-2 pointer-events-auto select-none ${className}`}>
      {/* Zoom In & Out */}
      <div className="bg-[#091126]/90 border border-slate-800/80 rounded-2xl p-1 shadow-2xl backdrop-blur-xl flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset Basin View"
          className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Focus Cyclone & Basins */}
      <div className="bg-[#091126]/90 border border-slate-800/80 rounded-2xl p-1 shadow-2xl backdrop-blur-xl flex flex-col gap-1 relative">
        <button
          onClick={handleFocusCyclone}
          title="Center Active Cyclone"
          className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
        >
          <MapPin className="h-4 w-4 text-cyan-400" />
        </button>

        <button
          onClick={() => setBasinMenuOpen(!basinMenuOpen)}
          title="Jump to Basin"
          className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
        >
          <Compass className="h-4 w-4 text-slate-300" />
        </button>

        {basinMenuOpen && (
          <div className="absolute right-full mr-2 top-0 w-44 rounded-2xl bg-[#091126] border border-slate-700 shadow-2xl p-2 z-50 space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 px-2 block font-bold">Ocean Basins</span>
            {basins.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  flyToLocation(b.coords, b.zoom);
                  setBasinMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        {onToggleLayers && (
          <button
            onClick={onToggleLayers}
            title="Layer Control"
            className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
          >
            <Layers className="h-4 w-4 text-slate-300" />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2.5 rounded-xl hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
