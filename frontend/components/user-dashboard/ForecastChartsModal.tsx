'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import IntensityChart from '@/components/charts/IntensityChart';
import PressureChart from '@/components/charts/PressureChart';
import ForecastEnsembleChart from '@/components/charts/ForecastEnsembleChart';
import { X, TrendingUp, Gauge, Cpu, BarChart2 } from 'lucide-react';

export default function ForecastChartsModal() {
  const { isChartsModalOpen, setIsChartsModalOpen, currentForecast, selectedCyclone } = useDashboard();
  const [activeTab, setActiveTab] = useState<'INTENSITY' | 'PRESSURE' | 'ENSEMBLE'>('INTENSITY');

  if (!isChartsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="w-full max-w-4xl rounded-3xl bg-[#091126] border border-cyan-500/40 shadow-2xl p-6 space-y-5 font-mono text-xs animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{selectedCyclone?.name || 'Cyclone Aruna'}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEMO FORECAST
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                72-Hour Ensemble Trajectory, Intensity & Pressure Multi-Model Analytics
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChartsModalOpen(false)}
            className="p-1.5 rounded-xl bg-[#060b19] border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <button
            onClick={() => setActiveTab('INTENSITY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'INTENSITY'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Wind Speed & Uncertainty</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESSURE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'PRESSURE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>Central Pressure Trajectory</span>
          </button>

          <button
            onClick={() => setActiveTab('ENSEMBLE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'ENSEMBLE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Model Ensemble Comparison</span>
          </button>
        </div>

        {/* Chart Viewport */}
        <div className="p-4 rounded-2xl bg-[#060b19] border border-slate-800">
          {activeTab === 'INTENSITY' && (
            <IntensityChart
              forecast={currentForecast}
              observedPoints={selectedCyclone?.observedTrack}
              height={320}
            />
          )}

          {activeTab === 'PRESSURE' && (
            <PressureChart
              forecast={currentForecast}
              observedPoints={selectedCyclone?.observedTrack}
              height={320}
            />
          )}

          {activeTab === 'ENSEMBLE' && (
            <ForecastEnsembleChart forecast={currentForecast} height={320} />
          )}
        </div>

        {/* Footer Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-400 pt-1">
          <div className="flex items-center gap-4">
            <span>Model Agreement: <strong className="text-white">{currentForecast?.modelAgreementPct || 91}%</strong></span>
            <span>Track Confidence: <strong className="text-emerald-400">{currentForecast?.trackConfidencePct || 87}%</strong></span>
            <span>RI Probability: <strong className="text-amber-400">{currentForecast?.rapidIntensificationProbPct || 74}%</strong></span>
          </div>

          <button
            onClick={() => setIsChartsModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
