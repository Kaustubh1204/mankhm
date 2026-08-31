'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import CycloneMapLibre from '@/components/map/CycloneMapLibre';
import IntensityChart from '@/components/charts/IntensityChart';
import PressureChart from '@/components/charts/PressureChart';
import ForecastEnsembleChart from '@/components/charts/ForecastEnsembleChart';
import { useDashboard } from '@/context/DashboardContext';
import { TrendingUp, Cpu, Gauge, Navigation, CheckCircle2 } from 'lucide-react';

function ForecastWorkspaceContent() {
  const { currentForecast, selectedCyclone } = useDashboard();

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header Banner */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" /> AI Forecasting Workspace
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO MODEL OUTPUT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              72-Hour Ensemble Vortex Trajectory & Intensity
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-model ensemble deep neural inference for {selectedCyclone?.name || 'Cyclone Aruna'} in the {selectedCyclone?.region || 'Bay of Bengal'}.
            </p>
          </div>
        </div>

        {/* Model Ensemble Information Card */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-cyan-500/30 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Ensemble Architecture</span>
            <span className="text-white font-extrabold text-sm block">CycloneSense Ensemble v1.0</span>
            <span className="text-slate-400 text-[10px]">Deep CNN-LSTM Physics Hybrid</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Forecast Horizon</span>
            <span className="text-cyan-300 font-extrabold text-sm block">72 Hours (+6h Interval)</span>
            <span className="text-slate-400 text-[10px]">6 to 72 hour lead-time</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Track Confidence</span>
            <span className="text-emerald-400 font-extrabold text-sm block">
              {currentForecast?.trackConfidencePct || 87}% Convergence
            </span>
            <span className="text-slate-400 text-[10px]">Multi-model cluster spread</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Model Status</span>
            <span className="text-amber-300 font-extrabold text-sm block flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Operational Demo
            </span>
            <span className="text-slate-400 text-[10px]">Last Run: 08:00 UTC (DEMO)</span>
          </div>
        </div>

        {/* GIS Trajectory Viewport & Ensemble Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* GIS Trajectory Map */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <Navigation className="h-4 w-4 text-cyan-400" /> Trajectory Cone & Ensemble Track
              </h3>
              <span className="text-slate-400 text-xs">Interactive GIS</span>
            </div>
            <div className="h-[420px] rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-[#060b19]">
              <CycloneMapLibre className="w-full h-full" />
            </div>
          </div>

          {/* Multi-Model Comparison Chart */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-400" /> Model Inter-Comparison
            </h3>
            <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
              <ForecastEnsembleChart forecast={currentForecast} height={345} />
            </div>
          </div>
        </div>

        {/* Detailed Wind Speed & Pressure Trajectory Curves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" /> Wind Speed Uncertainty Horizon
            </h3>
            <IntensityChart forecast={currentForecast} observedPoints={selectedCyclone?.observedTrack} height={280} />
          </div>

          <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4 text-teal-400" /> Central Pressure Trajectory (hPa)
            </h3>
            <PressureChart forecast={currentForecast} observedPoints={selectedCyclone?.observedTrack} height={280} />
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function ForecastPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <ForecastWorkspaceContent />
    </ProtectedRoute>
  );
}
