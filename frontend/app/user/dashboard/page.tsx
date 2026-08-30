'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import MapPanel from '@/components/map/MapPanel';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useCyclones, useForecast } from '@/hooks/useCycloneData';
import { Radio, Navigation, Cpu, Bell, Activity, ArrowRight, ShieldAlert, Bookmark } from 'lucide-react';

function UserDashboardOverview() {
  const { cyclones } = useCyclones();
  const { forecast } = useForecast('cyc_aruna');

  const activeSystem = cyclones[0] || null;

  return (
    <UserDashboardLayout>
      <div className="space-y-8 select-none">
        {/* Prominent System Status Header Banner */}
        <div className="p-4 rounded-2xl bg-[#091024] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>3 active systems are currently being monitored.</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  DEMO DATA
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Last updated: 2026-08-31 03:00 UTC | Sources: INSAT-3DS, Sentinel-1, Ocean Buoy Feed
              </p>
            </div>
          </div>
          <StatusBadge status="ONLINE" label="DEMO STREAM ACTIVE" />
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Active Cyclones"
            value="3"
            subtitle="Fictional demo systems"
            icon={Radio}
            statusColor="cyan"
          />
          <MetricCard
            label="Critical Alerts"
            value="2"
            subtitle="Emergency bulletins"
            icon={Bell}
            statusColor="red"
          />
          <MetricCard
            label="Forecast Updates"
            value="5"
            subtitle="72h trajectory cycles"
            icon={Activity}
            statusColor="teal"
          />
          <MetricCard
            label="Saved Cyclones"
            value="4"
            subtitle="Bookmarked systems"
            icon={Bookmark}
            statusColor="blue"
          />
        </div>

        {/* Active Cyclone & Live Map Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left GIS Live Map Preview */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Navigation className="h-4 w-4 text-cyan-400" />
                <span>Live GIS Monitor Preview</span>
              </h3>
              <Link
                href="/user/live-map"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>OPEN LIVE MAP</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <MapPanel height="h-[420px]" showTitle={false} />
          </div>

          {/* Right Primary Active Cyclone Card */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Primary Active System</span>
            </h3>

            <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 flex-1 flex flex-col justify-between shadow-xl">
              {activeSystem && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-black text-white">{activeSystem.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{activeSystem.region}</span>
                    </div>
                    <StatusBadge status={activeSystem.status} />
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Classification:</span>
                      <span className="text-cyan-300 font-bold">{activeSystem.classification}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Max Wind:</span>
                      <span className="text-white font-bold">{activeSystem.maxWindKmH} km/h ({activeSystem.maxWindKt} kt)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Central Pressure:</span>
                      <span className="text-teal-300 font-bold">{activeSystem.centralPressureHpa} hPa</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Movement:</span>
                      <span>{activeSystem.movementDirection} @ {activeSystem.movementSpeedKmH} km/h</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Last Observation:</span>
                      <span className="text-slate-400">{activeSystem.lastObservation}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href={activeSystem ? `/user/cyclones/${activeSystem.id}` : '/user/cyclones'}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>VIEW CYCLONE DETAILS</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Current Intelligence Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>Current Intelligence Cards (DEMO DATA)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Intensity Trend</span>
              <span className="text-base font-extrabold text-cyan-300 block">
                {forecast?.intensityTrend || 'Strengthening'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Model ensemble 12h projection
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Rapid Intensification</span>
              <span className="text-base font-extrabold text-amber-400 block">
                {forecast?.rapidIntensificationRisk || 'Elevated'} ({forecast?.rapidIntensificationProbPct || 74}%)
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Neural cloud-top probability
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Track Confidence</span>
              <span className="text-base font-extrabold text-emerald-400 block">
                {forecast?.trackConfidencePct || 87}% Confidence
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                72h ensemble convergence
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Regional Risk</span>
              <span className="text-base font-extrabold text-red-400 block flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                <span>High Hazard</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                North Odisha Coastal Zone
              </span>
            </div>
          </div>
        </div>

        {/* Compact List of Other Active Systems */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            <span>Other Monitored Systems</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cyclones.slice(1).map((c) => (
              <Link
                key={c.id}
                href={`/user/cyclones/${c.id}`}
                className="p-4 rounded-2xl bg-[#091024] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono group-hover:text-cyan-400">{c.name}</span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <p className="text-xs text-slate-400">{c.classification}</p>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                  <span>Wind: {c.maxWindKmH} km/h</span>
                  <span>Pressure: {c.centralPressureHpa} hPa</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <UserDashboardOverview />
    </ProtectedRoute>
  );
}
