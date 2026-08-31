'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import MapPanel from '@/components/map/MapPanel';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import { useCyclone, useForecast, useRisk, useAlerts, useSatelliteLayers } from '@/hooks/useCycloneData';
import { Bookmark, Share2, FileText, Cpu, AlertTriangle } from 'lucide-react';

export default function CycloneDetailClient({ id }: { id: string }) {
  const { cyclone } = useCyclone(id);
  const { forecast } = useForecast(id);
  const { riskRegions } = useRisk();
  const { alerts } = useAlerts();
  const { layers } = useSatelliteLayers();

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Track' | 'Intensity' | 'Forecast' | 'Risk' | 'Satellite' | 'History' | 'Alerts'
  >('Overview');

  const [isSaved, setIsSaved] = useState(cyclone?.isSaved || false);
  const [activeSatLayer, setActiveSatLayer] = useState<string>('VISIBLE');

  const tabs = [
    'Overview',
    'Track',
    'Intensity',
    'Forecast',
    'Risk',
    'Satellite',
    'History',
    'Alerts',
  ] as const;

  return (
    <ProtectedRoute requiredRole="USER">
      <UserDashboardLayout>
        <div className="space-y-6 select-none">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-mono font-bold text-white tracking-wide">
                  {cyclone?.name || `Cyclone ${id}`}
                </h1>
                <StatusBadge status={cyclone?.status || 'ACTIVE'} />
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ID: {id} | Region: {cyclone?.region || 'Bay of Bengal'} | Last Obs:{' '}
                {cyclone?.lastObservation ? new Date(cyclone.lastObservation).toUTCString() : 'Live'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSaved
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>{isSaved ? 'Saved' : 'Save Storm'}</span>
              </button>

              <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share Data</span>
              </button>

              <button className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                <FileText className="h-4 w-4" />
                <span>Export Bulletin</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 ${
                  activeTab === tab
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-800">
                  <MapPanel
                    height="100%"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#091024] border border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Core Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Classification</span>
                      <span className="text-white font-bold block mt-0.5">{cyclone?.classification || 'VSCS'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Max Wind</span>
                      <span className="text-cyan-400 font-bold block mt-0.5">
                        {cyclone?.maxWindKt || 78} kt ({cyclone?.maxWindKmH || 145} km/h)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Central Pressure</span>
                      <span className="text-white font-bold block mt-0.5">{cyclone?.centralPressureHpa || 968} hPa</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Movement</span>
                      <span className="text-white font-bold block mt-0.5">
                        {cyclone?.movementDirection || 'NE'} @ {cyclone?.movementSpeedKmH || 18} km/h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091024] border border-slate-800 space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Rapid Intensification</span>
                    <span className="text-amber-400">{forecast?.rapidIntensificationRisk || 'ELEVATED'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Model probability of &ge;30kt wind speed increase in 24h is{' '}
                    <span className="text-amber-300 font-bold">{forecast?.rapidIntensificationProbPct || 54}%</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: FORECAST */}
          {activeTab === 'Forecast' && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                72-Hour Cone & Track Projection Points
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {forecast?.points.map((pt) => (
                  <div key={pt.timeHorizon} className="p-4 rounded-xl bg-[#091024] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">{pt.timeHorizon}</span>
                      <span className="text-[10px] text-slate-400">{pt.classification}</span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <p>Location: {pt.latitude.toFixed(1)}°N, {pt.longitude.toFixed(1)}°E</p>
                      <p>Wind: <span className="text-white font-bold">{pt.windSpeedKt} kt</span></p>
                      <p>Pressure: {pt.pressureHpa} hPa</p>
                      <p className="text-[10px] text-slate-400">Radius: &plusmn;{pt.confidenceRadiusKm} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}
