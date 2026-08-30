'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import MapPanel from '@/components/map/MapPanel';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import { useCyclone, useForecast, useRisk, useAlerts, useSatelliteLayers } from '@/hooks/useCycloneData';
import { Bookmark, Share2, FileText, Cpu, AlertTriangle } from 'lucide-react';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

function CycloneDetailContent({ id }: { id: string }) {
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

  const currentCyc = cyclone || {
    id: id,
    name: 'Cyclone Aruna',
    classification: 'Very Severe Cyclonic Storm',
    categoryNumber: 3,
    maxWindKmH: 145,
    maxWindKt: 78,
    centralPressureHpa: 968,
    latitude: 16.4,
    longitude: 87.2,
    movementDirection: 'NW',
    movementSpeedKmH: 16,
    movementSpeedKt: 9,
    lastObservation: '2026-08-31 03:00 UTC',
    status: 'ACTIVE' as const,
    region: 'Bay of Bengal',
  };

  const historyColumns: Column<{ time: string; lat: number; lon: number; wind: number; pressure: number; class: string }>[] = [
    { header: 'Observation Time', accessorKey: 'time' },
    { header: 'Position', cell: (r) => `${r.lat}°N, ${r.lon}°E` },
    { header: 'Wind Speed', cell: (r) => `${r.wind} km/h` },
    { header: 'Central Pressure', cell: (r) => `${r.pressure} hPa` },
    { header: 'Classification', accessorKey: 'class' },
  ];

  const historySample = [
    { time: '2026-08-31 03:00 UTC', lat: 16.4, lon: 87.2, wind: 145, pressure: 968, class: 'Very Severe Cyclonic Storm' },
    { time: '2026-08-31 00:00 UTC', lat: 15.8, lon: 87.7, wind: 135, pressure: 972, class: 'Very Severe Cyclonic Storm' },
    { time: '2026-08-30 21:00 UTC', lat: 15.2, lon: 88.1, wind: 120, pressure: 978, class: 'Severe Cyclonic Storm' },
    { time: '2026-08-30 18:00 UTC', lat: 14.5, lon: 88.6, wind: 100, pressure: 985, class: 'Severe Cyclonic Storm' },
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        {/* Header with Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091024] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">{currentCyc.region}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{currentCyc.name}</span>
              <StatusBadge status={currentCyc.status} />
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Classification: <span className="text-cyan-300 font-bold">{currentCyc.classification}</span> | Last Observation: {currentCyc.lastObservation}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                isSaved
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                  : 'bg-[#060b19] text-slate-300 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-cyan-400 text-cyan-400' : ''}`} />
              <span>{isSaved ? 'SAVED' : 'SAVE CYCLONE'}</span>
            </button>

            <button
              onClick={() => alert(`Share URL copied: http://localhost:3000/user/cyclones/${currentCyc.id}`)}
              className="px-4 py-2 rounded-xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold text-slate-300 flex items-center gap-2 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>SHARE</span>
            </button>

            <button
              onClick={() => alert(`Generating PDF report for ${currentCyc.name}...`)}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 flex items-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>GENERATE REPORT</span>
            </button>
          </div>
        </div>

        {/* Detail Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Maximum Wind</span>
                <span className="text-2xl font-black text-white block">{currentCyc.maxWindKmH} km/h</span>
                <span className="text-[10px] font-mono text-cyan-400">{currentCyc.maxWindKt} knots sustained</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Central Pressure</span>
                <span className="text-2xl font-black text-white block">{currentCyc.centralPressureHpa} hPa</span>
                <span className="text-[10px] font-mono text-teal-400">Minimum sea-level</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Movement Vector</span>
                <span className="text-2xl font-black text-white block">{currentCyc.movementDirection} @ {currentCyc.movementSpeedKmH} km/h</span>
                <span className="text-[10px] font-mono text-slate-400">Heading direction & speed</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Geographic Position</span>
                <span className="text-2xl font-black text-white block">{currentCyc.latitude}°N, {currentCyc.longitude}°E</span>
                <span className="text-[10px] font-mono text-cyan-400">Bay of Bengal Northwest</span>
              </div>
            </div>

            {/* Premium AI Analysis Card */}
            <div className="p-6 rounded-3xl bg-[#0a1228] border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  <span>AI Model Ensemble Neural Insights (DEMO DATA)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  AI-ASSISTED ANALYSIS
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                &quot;Model ensemble indicates continued intensification over the next 12 hours as the storm traverses high sea-surface temperatures (30°C). Deep convective eye-wall symmetry score is 8.4/10. Rapid intensification risk is elevated prior to Odisha coastal landfall.&quot;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block">Intensity Trend</span>
                  <span className="text-cyan-300 font-bold text-sm">{forecast?.intensityTrend || 'STRENGTHENING'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Rapid Intensification Risk</span>
                  <span className="text-amber-400 font-bold text-sm">{forecast?.rapidIntensificationRisk || 'ELEVATED'} ({forecast?.rapidIntensificationProbPct || 74}%)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Model Confidence Score</span>
                  <span className="text-emerald-400 font-bold text-sm">{forecast?.trackConfidencePct || 87}% Convergence</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: TRACK */}
        {activeTab === 'Track' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Observed & Projected Trajectory Cone
            </h3>
            <MapPanel height="h-[460px]" showTitle={false} />
          </div>
        )}

        {/* Tab 3: INTENSITY */}
        {activeTab === 'Intensity' && (
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Intensity Evolution (Wind Speed & Pressure Trend)
            </h3>
            <div className="p-8 text-center text-xs font-mono text-slate-400 border border-slate-800 rounded-xl bg-[#060b19]">
              [Interactive Intensity Chart: Wind Speed (145 km/h) & Central Pressure (968 hPa) over 72h horizon]
            </div>
          </div>
        )}

        {/* Tab 4: FORECAST */}
        {activeTab === 'Forecast' && (
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                72-Hour Ensemble Forecast Points
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">AI-ASSISTED FORECAST</span>
            </div>

            <div className="space-y-3">
              {forecast?.points.map((pt) => (
                <div key={pt.timeHorizon} className="p-4 rounded-xl bg-[#060b19] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                  <span className="font-bold text-cyan-300 w-16">{pt.timeHorizon}</span>
                  <span className="text-slate-400">{pt.timestamp}</span>
                  <span className="text-white">{pt.latitude}°N, {pt.longitude}°E</span>
                  <span className="text-white font-bold">{pt.windSpeedKmH} km/h ({pt.windSpeedKt} kt)</span>
                  <span className="text-teal-300">{pt.pressureHpa} hPa</span>
                  <StatusBadge status="ACTIVE" label={pt.classification} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: RISK */}
        {activeTab === 'Risk' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
              <span>AI-ASSISTED RISK ASSESSMENT (DEMO) - NOT AN OFFICIAL GOVERNMENT WARNING</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskRegions.map((rr) => (
                <div key={rr.id} className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{rr.regionName}</h4>
                    <StatusBadge status={rr.riskLevel} />
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <p>Storm Surge: <span className="text-cyan-300 font-bold">{rr.stormSurgeMeters} meters</span></p>
                    <p>Wind Risk Score: <span className="text-amber-400 font-bold">{rr.windRiskScore}/100</span></p>
                    <p>Population Exposure: {rr.populationExposure}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: SATELLITE */}
        {activeTab === 'Satellite' && (
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Orbital Satellite Sensor Intelligence (DEMO)
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">DEMO SATELLITE DATA</span>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {layers.map((lyr) => (
                <button
                  key={lyr.type}
                  onClick={() => setActiveSatLayer(lyr.type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeSatLayer === lyr.type
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lyr.type}
                </button>
              ))}
            </div>

            <div className="h-64 rounded-2xl bg-[#050917] border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                {layers.find((l) => l.type === activeSatLayer)?.title || 'INSAT-3DS Orbital Scan'}
              </span>
              <p className="text-xs text-slate-400 max-w-md">
                {layers.find((l) => l.type === activeSatLayer)?.description}
              </p>
              <span className="text-[10px] font-mono text-slate-500">
                Resolution: {layers.find((l) => l.type === activeSatLayer)?.resolutionKm} km | Timestamp: 2026-08-31 03:00 UTC
              </span>
            </div>
          </div>
        )}

        {/* Tab 7: HISTORY */}
        {activeTab === 'History' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Vortex Observation History
            </h3>
            <DataTable columns={historyColumns} data={historySample} />
          </div>
        )}

        {/* Tab 8: ALERTS */}
        {activeTab === 'Alerts' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Related Emergency Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-4 rounded-xl bg-[#091024] border border-slate-800 flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{alt.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{alt.description}</p>
                    <span className="text-[10px] font-mono text-slate-500 block mt-2">{alt.timestamp} | {alt.source}</span>
                  </div>
                  <StatusBadge status={alt.severity} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

export default function CycloneDetailPage({ params }: DetailPageProps) {
  const resolvedParams = React.use(params);
  return (
    <ProtectedRoute requiredRole="USER">
      <CycloneDetailContent id={resolvedParams.id} />
    </ProtectedRoute>
  );
}
