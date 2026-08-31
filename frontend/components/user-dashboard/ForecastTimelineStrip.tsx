'use client';

import React, { useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Play, Pause, BarChart2, Clock, ChevronRight } from 'lucide-react';

interface ForecastTimelineStripProps {
  className?: string;
}

export default function ForecastTimelineStrip({ className = '' }: ForecastTimelineStripProps) {
  const {
    currentForecast,
    selectedHorizon,
    setSelectedHorizon,
    isPlayingTimeline,
    setIsPlayingTimeline,
    setIsChartsModalOpen,
    selectedCyclone,
  } = useDashboard();

  const forecastPoints = currentForecast?.points || [
    { timeHorizon: 'NOW', timestamp: '08:15 UTC', windSpeedKmH: 145, centralPressureHpa: 968, classification: 'Very Severe Cyclonic Storm' },
    { timeHorizon: '+6h', timestamp: '14:00 UTC', windSpeedKmH: 155, centralPressureHpa: 962, classification: 'Very Severe Cyclonic Storm' },
    { timeHorizon: '+12h', timestamp: '20:00 UTC', windSpeedKmH: 168, centralPressureHpa: 954, classification: 'Extremely Severe Cyclonic Storm' },
    { timeHorizon: '+24h', timestamp: '08:00 UTC', windSpeedKmH: 180, centralPressureHpa: 946, classification: 'Extremely Severe Cyclonic Storm' },
    { timeHorizon: '+48h', timestamp: '08:00 UTC', windSpeedKmH: 140, centralPressureHpa: 965, classification: 'Very Severe Cyclonic Storm' },
    { timeHorizon: '+72h', timestamp: '08:00 UTC', windSpeedKmH: 70, centralPressureHpa: 992, classification: 'Cyclonic Storm' },
  ];

  // Timeline automated playback animation
  useEffect(() => {
    if (!isPlayingTimeline) return;

    const horizons = forecastPoints.map((p) => p.timeHorizon);
    const interval = setInterval(() => {
      const currIdx = horizons.indexOf(selectedHorizon);
      const nextIdx = (currIdx + 1) % horizons.length;
      setSelectedHorizon(horizons[nextIdx]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlayingTimeline, forecastPoints, selectedHorizon, setSelectedHorizon]);

  return (
    <div
      className={`rounded-3xl bg-[#091126]/92 border border-slate-800/80 shadow-2xl backdrop-blur-2xl p-3 text-xs font-mono select-none pointer-events-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${className}`}
    >
      {/* Playback Controls & Label */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
          className={`p-2.5 rounded-2xl transition-all border flex items-center justify-center ${
            isPlayingTimeline
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg'
              : 'bg-[#060b19] text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20'
          }`}
          title={isPlayingTimeline ? 'Pause Playback' : 'Play Trajectory Animation'}
        >
          {isPlayingTimeline ? <Pause className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-cyan-300" />}
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <Clock className="h-3 w-3 text-cyan-400" />
            <span>72H FORECAST STRIP</span>
            <span className="px-1.5 py-0.2 rounded text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
              DEMO FORECAST
            </span>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold">{selectedCyclone?.name || 'Cyclone Aruna'}</span>
        </div>
      </div>

      {/* Horizontal Weather-Style Forecast Cards */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0 flex-1 justify-start md:justify-center">
        {forecastPoints.map((pt) => {
          const isSelected = selectedHorizon === pt.timeHorizon;

          return (
            <button
              key={pt.timeHorizon}
              onClick={() => setSelectedHorizon(pt.timeHorizon)}
              className={`flex-1 min-w-[105px] max-w-[130px] p-2 rounded-2xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(0,180,216,0.25)] scale-[1.02]'
                  : 'bg-[#060b19]/90 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-black ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {pt.timeHorizon}
                </span>
                <span className="text-[9px] text-slate-500">{pt.timestamp.split(' ')[0]}</span>
              </div>

              <div className="pt-1">
                <span className="text-xs font-black text-white block truncate">
                  {pt.windSpeedKmH} <span className="text-[9px] font-normal text-slate-400">km/h</span>
                </span>
                <span className="text-[9px] text-teal-300 block">{pt.centralPressureHpa} hPa</span>
              </div>

              <div className="text-[8px] text-slate-400 truncate pt-0.5" title={pt.classification}>
                {pt.classification.replace(' Cyclonic Storm', '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expand Analytics Button */}
      <div className="shrink-0 flex items-center justify-end">
        <button
          onClick={() => setIsChartsModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <BarChart2 className="h-4 w-4" />
          <span className="hidden sm:inline">ANALYTICS & CHARTS</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
