'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import CycloneMapLibre from '@/components/map/CycloneMapLibre';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useDashboard } from '@/context/DashboardContext';
import { Cyclone } from '@/types/cyclone';
import { Search, Radio, Wind, Gauge, Compass, ArrowRight, Bookmark } from 'lucide-react';

function CyclonesMonitorContent() {
  const { cyclones, selectedCycloneId, setSelectedCycloneId, flyToLocation } = useDashboard();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DEVELOPING' | 'WEAKENING'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = cyclones.filter((c) => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.region.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSelectCyclone = (c: Cyclone) => {
    setSelectedCycloneId(c.id);
    flyToLocation([c.latitude, c.longitude], 6.5);
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="h-4 w-4" /> Live Cyclone Monitoring
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tropical Cyclone Vortex Systems
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Realtime multi-basin cyclone tracking, intensity classification, and GIS spatial mapping.
            </p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091126] border border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            {(['ALL', 'ACTIVE', 'DEVELOPING', 'WEAKENING'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cyclone or region..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Split View: Left Cyclone Cards List + Right Interactive GIS Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Cyclone Cards List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            {filtered.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#091126] border border-slate-800 text-center text-slate-400">
                No cyclone systems found matching filter criteria.
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = c.id === selectedCycloneId;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCyclone(c)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative ${
                      isSelected
                        ? 'bg-[#091530] border-cyan-400 shadow-[0_0_24px_rgba(0,180,216,0.15)] scale-[1.01]'
                        : 'bg-[#091126] border-slate-800 hover:border-slate-700 hover:bg-[#0a142c]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white">{c.name}</h3>
                          <StatusBadge status={c.status} size="sm" />
                        </div>
                        <span className="text-[11px] text-cyan-300 font-bold block mt-0.5">{c.classification}</span>
                        <span className="text-[10px] text-slate-400">{c.region} Basin</span>
                      </div>

                      {c.isSaved && (
                        <Bookmark className="h-4 w-4 text-cyan-400 fill-cyan-400 shrink-0" />
                      )}
                    </div>

                    {/* Metric Rows */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Wind className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Wind: <strong>{c.maxWindKmH} km/h</strong> ({c.maxWindKt} kt)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Gauge className="h-3.5 w-3.5 text-teal-400" />
                        <span>Pressure: <strong className="text-teal-300">{c.centralPressureHpa} hPa</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 col-span-2">
                        <Compass className="h-3.5 w-3.5 text-blue-400" />
                        <span>Vector: {c.movementDirection} @ {c.movementSpeedKmH} km/h • Position: {c.latitude}°N, {c.longitude}°E</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>Obs: {c.lastObservation}</span>
                      <Link
                        href={`/user/cyclones/${c.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>FULL DETAILS</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Interactive GIS Map (7 Cols) */}
          <div className="lg:col-span-7 h-[540px] sticky top-24 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#060b19]">
            <CycloneMapLibre className="w-full h-full" />
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function CyclonesPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <CyclonesMonitorContent />
    </ProtectedRoute>
  );
}
