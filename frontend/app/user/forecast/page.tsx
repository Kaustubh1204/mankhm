'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import MapPanel from '@/components/map/MapPanel';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useForecast } from '@/hooks/useCycloneData';
import { TrendingUp, Navigation } from 'lucide-react';

function ForecastContent() {
  const { forecast } = useForecast('cyc_aruna');

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        {/* AI Disclaimer Header */}
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-between">
          <div>
            <span className="font-bold uppercase block mb-0.5">AI-ASSISTED FORECAST (DEMO)</span>
            <p className="text-slate-300 font-sans">
              Ensemble trajectory projections are computed using CycloneSense Deep Learning Engine v1.0. Always verify with official IMD/JTWC bulletins.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shrink-0">
            DEMO MODEL OUTPUT
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white">Intensity & Track Forecast Workspace</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Ensemble deep learning 72h–120h vortex trajectory & pressure trend projections for Cyclone Aruna.
          </p>
        </div>

        {/* Model Information Card */}
        <div className="p-6 rounded-3xl bg-[#091024] border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-6 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-400 block">Ensemble Model</span>
            <span className="text-white font-bold text-sm">CycloneSense Ensemble v1.0</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">Prediction Horizon</span>
            <span className="text-cyan-300 font-bold text-sm">72 Hours (+6h step)</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">Last Model Run</span>
            <span className="text-slate-200 font-bold text-sm">2026-08-31 03:00 UTC</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">Track Confidence</span>
            <span className="text-emerald-400 font-bold text-sm">{forecast?.trackConfidencePct || 87}% Convergence</span>
          </div>
        </div>

        {/* Track Forecast & Intensity Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Track Forecast GIS Viewport */}
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Navigation className="h-4 w-4 text-cyan-400" />
              <span>Track Forecast & Uncertainty Cone</span>
            </h3>
            <MapPanel height="h-[380px]" showTitle={false} />
          </div>

          {/* Right: Intensity & Pressure Charts */}
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Intensity & Minimum Pressure Trajectory</span>
            </h3>

            <div className="space-y-3">
              {forecast?.points.slice(0, 5).map((pt) => (
                <div key={pt.timeHorizon} className="p-3 rounded-xl bg-[#060b19] border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-300 w-12">{pt.timeHorizon}</span>
                  <span className="text-white font-bold">{pt.windSpeedKmH} km/h</span>
                  <span className="text-teal-300">{pt.pressureHpa} hPa</span>
                  <StatusBadge status="ACTIVE" label={pt.classification} size="sm" />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Model Agreement: <strong className="text-white">{forecast?.modelAgreementPct}%</strong></span>
              <span>Rapid Intensification: <strong className="text-amber-400">{forecast?.rapidIntensificationRisk}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function ForecastPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <ForecastContent />
    </ProtectedRoute>
  );
}
