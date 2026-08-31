'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import CycloneMapLibre from '@/components/map/CycloneMapLibre';
import IntensityChart from '@/components/charts/IntensityChart';
import PressureChart from '@/components/charts/PressureChart';
import ForecastEnsembleChart from '@/components/charts/ForecastEnsembleChart';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import { useCyclone, useForecast, useRisk, useAlerts, useSatelliteLayers } from '@/hooks/useCycloneData';
import { Cyclone } from '@/types/cyclone';
import { Bookmark, Share2, FileText, Cpu, Zap, Wind, Gauge, Compass, Navigation, Clock, ShieldAlert, CloudRain, Waves, Check } from 'lucide-react';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

function CycloneDetailContent({ id }: { id: string }) {
  const { cyclone, toggleSave } = useCyclone(id);
  const { forecast } = useForecast(id);
  const { riskRegions } = useRisk(id);
  const { alerts } = useAlerts(id);
  const { layers: satelliteLayers } = useSatelliteLayers();

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Track' | 'Intensity' | 'Forecast' | 'Risk' | 'Satellite' | 'History' | 'Alerts'
  >('Overview');

  const [activeSatLayer, setActiveSatLayer] = useState<string>('INFRARED');
  const [shareCopied, setShareCopied] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

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
    latitude: 15.8,
    longitude: 88.4,
    movementDirection: 'NW',
    movementSpeedKmH: 14,
    movementSpeedKt: 8,
    lastObservation: '08:15 UTC (DEMO)',
    status: 'ACTIVE' as const,
    intensityTrend: 'STRENGTHENING' as const,
    rapidIntensificationRisk: 'ELEVATED' as const,
    rapidIntensificationProbPct: 74,
    isSaved: true,
    region: 'Bay of Bengal',
    basin: 'Bay of Bengal' as const,
    observedTrack: [],
    forecast: null as unknown as Cyclone['forecast'],
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  const historyColumns: Column<{ time: string; lat: number; lon: number; wind: number; pressure: number; class: string }>[] = [
    { header: 'Observation Time', accessorKey: 'time' },
    { header: 'Position', cell: (r) => `${r.lat}°N, ${r.lon}°E` },
    { header: 'Wind Speed', cell: (r) => `${r.wind} km/h` },
    { header: 'Central Pressure', cell: (r) => `${r.pressure} hPa` },
    { header: 'Classification', accessorKey: 'class' },
  ];

  const historySample = [
    { time: '2026-08-31 08:15 UTC', lat: 15.8, lon: 88.4, wind: 145, pressure: 968, class: 'Very Severe Cyclonic Storm' },
    { time: '2026-08-31 02:00 UTC', lat: 15.2, lon: 89.1, wind: 132, pressure: 973, class: 'Very Severe Cyclonic Storm' },
    { time: '2026-08-30 20:00 UTC', lat: 14.6, lon: 89.9, wind: 118, pressure: 978, class: 'Severe Cyclonic Storm' },
    { time: '2026-08-30 14:00 UTC', lat: 13.9, lon: 90.7, wind: 100, pressure: 984, class: 'Severe Cyclonic Storm' },
    { time: '2026-08-30 08:00 UTC', lat: 13.2, lon: 91.5, wind: 85, pressure: 990, class: 'Cyclonic Storm' },
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header with Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-cyan-400 font-bold uppercase">{currentCyc.region} Basin</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{currentCyc.name}</span>
              <StatusBadge status={currentCyc.status} />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Classification: <span className="text-cyan-300 font-bold">{currentCyc.classification}</span> | Last Updated: {currentCyc.lastObservation}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleSave}
              className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-2 transition-all border ${
                currentCyc.isSaved
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                  : 'bg-[#060b19] text-slate-300 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${currentCyc.isSaved ? 'fill-cyan-400 text-cyan-400' : ''}`} />
              <span>{currentCyc.isSaved ? 'BOOKMARKED' : 'SAVE CYCLONE'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-2xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/40 font-bold text-slate-300 flex items-center gap-2 transition-colors"
            >
              {shareCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span>{shareCopied ? 'LINK COPIED' : 'SHARE'}</span>
            </button>

            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 font-bold text-cyan-300 flex items-center gap-2 transition-colors shadow-md"
            >
              <FileText className="h-4 w-4" />
              <span>{reportGenerated ? 'REPORT READY (PDF)' : 'GENERATE REPORT'}</span>
            </button>
          </div>
        </div>

        {/* 8 Detail Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap border ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* Core Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-[#091126] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-cyan-400" /> Maximum Wind Speed
                </span>
                <span className="text-2xl font-black text-white block">{currentCyc.maxWindKmH} km/h</span>
                <span className="text-[10px] text-cyan-400 font-bold">{currentCyc.maxWindKt} knots sustained</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#091126] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-teal-400" /> Central Pressure
                </span>
                <span className="text-2xl font-black text-teal-300 block">{currentCyc.centralPressureHpa} hPa</span>
                <span className="text-[10px] text-slate-400">Minimum sea-level pressure</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#091126] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-blue-400" /> Movement Vector
                </span>
                <span className="text-2xl font-black text-white block">{currentCyc.movementDirection} @ {currentCyc.movementSpeedKmH} km/h</span>
                <span className="text-[10px] text-slate-400">Heading direction & translational speed</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#091126] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-cyan-400" /> Geographic Position
                </span>
                <span className="text-2xl font-black text-white block">{currentCyc.latitude}°N, {currentCyc.longitude}°E</span>
                <span className="text-[10px] text-cyan-400 font-bold">{currentCyc.region}</span>
              </div>
            </div>

            {/* AI Neural Analysis Card */}
            <div className="p-6 rounded-3xl bg-[#0a142e] border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  <span>AI Cyclone Neural Intelligence (DEMO MODEL OUTPUT)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  AI-ASSISTED
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-[#060b19] p-4 rounded-2xl border border-slate-800">
                &quot;{forecast?.aiSummary || 'Model analysis indicates continued strengthening during the next 12 hours.'}&quot;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Intensity Trend</span>
                  <span className="text-cyan-300 font-bold text-sm">{forecast?.intensityTrend || 'STRENGTHENING'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rapid Intensification</span>
                  <span className="text-amber-400 font-bold text-sm">{forecast?.rapidIntensificationRisk || 'ELEVATED'} ({forecast?.rapidIntensificationProbPct || 74}%)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Track Confidence</span>
                  <span className="text-emerald-400 font-bold text-sm">{forecast?.trackConfidencePct || 87}% Convergence</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Model Agreement</span>
                  <span className="text-white font-bold text-sm">{forecast?.modelAgreementPct || 91}% Consensus</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRACK */}
        {activeTab === 'Track' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                Observed Track & Projected Uncertainty Cone
              </h3>
              <span className="text-slate-400 text-xs">Interactive GIS Viewport</span>
            </div>
            <div className="h-[520px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#060b19]">
              <CycloneMapLibre className="w-full h-full" />
            </div>
          </div>
        )}

        {/* TAB 3: INTENSITY */}
        {activeTab === 'Intensity' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                Wind Speed Trajectory & 72-Hour Uncertainty Envelope
              </h3>
              <IntensityChart forecast={forecast} observedPoints={currentCyc.observedTrack} height={320} />
            </div>

            <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                Central Minimum Pressure Evolution (hPa)
              </h3>
              <PressureChart forecast={forecast} observedPoints={currentCyc.observedTrack} height={280} />
            </div>
          </div>
        )}

        {/* TAB 4: FORECAST */}
        {activeTab === 'Forecast' && (
          <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                  72-Hour Ensemble Forecast Points
                </h3>
                <p className="text-[10px] text-slate-400">Time-step position, wind, pressure and classification</p>
              </div>
              <span className="text-xs font-bold text-cyan-400">AI-ASSISTED FORECAST</span>
            </div>

            <div className="space-y-2.5">
              {forecast?.points.map((pt) => (
                <div
                  key={pt.timeHorizon}
                  className="p-4 rounded-2xl bg-[#060b19] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <span className="font-extrabold text-cyan-300 w-16">{pt.timeHorizon}</span>
                  <span className="text-slate-400">{pt.timestamp}</span>
                  <span className="text-white">{pt.latitude}°N, {pt.longitude}°E</span>
                  <span className="text-white font-bold">{pt.windSpeedKmH} km/h ({pt.windSpeedKt} kt)</span>
                  <span className="text-teal-300 font-bold">{pt.centralPressureHpa} hPa</span>
                  <StatusBadge status="ACTIVE" label={pt.classification} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RISK */}
        {activeTab === 'Risk' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
              <span>AI-ASSISTED RISK ASSESSMENT (DEMO) - COASTAL SURGE & HAZARD ZONES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskRegions.map((rr) => (
                <div key={rr.id} className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rr.regionName}</h4>
                      <span className="text-[10px] text-slate-400">{rr.stateCountry}</span>
                    </div>
                    <StatusBadge status={rr.riskLevel} />
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Wind className="h-3.5 w-3.5 text-cyan-400" /> Wind Hazard:</span>
                      <strong className="text-white">{rr.windRiskScore}/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><CloudRain className="h-3.5 w-3.5 text-blue-400" /> Rainfall Exposure:</span>
                      <strong className="text-white">{rr.rainfallRiskScore}/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Waves className="h-3.5 w-3.5 text-teal-400" /> Peak Surge:</span>
                      <strong className="text-cyan-300">{rr.stormSurgeMeters} meters</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Population Exposure:</span>
                      <strong className="text-amber-300">{rr.populationExposure}</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">{rr.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SATELLITE */}
        {activeTab === 'Satellite' && (
          <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                  Orbital Satellite Sensor Intelligence (DEMO)
                </h3>
                <p className="text-[10px] text-slate-400">Multi-spectral cloud radiance analysis</p>
              </div>
              <span className="text-xs font-bold text-amber-400">DEMO SATELLITE DATA</span>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {satelliteLayers.map((lyr) => (
                <button
                  key={lyr.type}
                  onClick={() => setActiveSatLayer(lyr.type)}
                  className={`px-3.5 py-2 rounded-2xl font-bold transition-all border ${
                    activeSatLayer === lyr.type
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lyr.title.split(' ')[0]} ({lyr.type})
                </button>
              ))}
            </div>

            <div className="h-72 rounded-3xl bg-[#050917] border border-slate-800 flex flex-col items-center justify-center text-center p-8 space-y-3 shadow-inner">
              <span className="text-sm text-cyan-400 font-bold uppercase">
                {satelliteLayers.find((l) => l.type === activeSatLayer)?.title || 'INSAT-3DS Orbital Scan'}
              </span>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                {satelliteLayers.find((l) => l.type === activeSatLayer)?.description}
              </p>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-2">
                <span>Satellite: <strong>{satelliteLayers.find((l) => l.type === activeSatLayer)?.satelliteName}</strong></span>
                <span>Resolution: <strong>{satelliteLayers.find((l) => l.type === activeSatLayer)?.resolutionKm} km</strong></span>
                <span>Timestamp: <strong>08:15 UTC (DEMO)</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HISTORY */}
        {activeTab === 'History' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">
              Observed Vortex Sounding History
            </h3>
            <DataTable columns={historyColumns} data={historySample} />
          </div>
        )}

        {/* TAB 8: ALERTS */}
        {activeTab === 'Alerts' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">
              Associated Emergency Bulletins ({alerts.length})
            </h3>
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-5 rounded-2xl bg-[#091126] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{alt.title}</h4>
                    <StatusBadge status={alt.severity} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alt.description}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">{alt.timestamp} • Source: {alt.source}</span>
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
