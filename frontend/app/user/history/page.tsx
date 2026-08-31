'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useHistory } from '@/hooks/useCycloneData';
import { HistoricalCyclone } from '@/types/cyclone';
import { History, Search, X, Calendar, Wind, Gauge, MapPin } from 'lucide-react';

function HistoryContent() {
  const { records } = useHistory();
  const [timeZone, setTimeZone] = useState<'UTC' | 'IST'>('UTC');
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HistoricalCyclone | null>(null);

  const filtered = records.filter((r) => {
    if (yearFilter !== 'ALL' && String(r.year) !== yearFilter) return false;
    if (regionFilter !== 'ALL' && r.region !== regionFilter) return false;
    if (search && !r.cycloneName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<HistoricalCyclone>[] = [
    {
      header: 'Cyclone System',
      accessorKey: 'cycloneName',
      cell: (row) => (
        <button
          onClick={() => setSelectedRecord(row)}
          className="font-bold text-white hover:text-cyan-400 font-mono text-left block"
        >
          {row.cycloneName}
        </button>
      ),
    },
    { header: 'Basin', accessorKey: 'region' },
    { header: 'Season Year', accessorKey: 'year', cell: (row) => <span className="font-mono text-cyan-300 font-bold">{row.year}</span> },
    { header: 'Start Date', accessorKey: 'startDate' },
    { header: 'End Date', accessorKey: 'endDate' },
    { header: 'Peak Wind', accessorKey: 'peakWindKmH', cell: (row) => `${row.peakWindKmH} km/h (${row.peakWindKt} kt)` },
    { header: 'Min Pressure', accessorKey: 'minPressureHpa', cell: (row) => `${row.minPressureHpa} hPa` },
    { header: 'Duration', accessorKey: 'durationDays', cell: (row) => `${row.durationDays} days` },
    { header: 'Classification', accessorKey: 'maxClassification', cell: (row) => <StatusBadge status="ACTIVE" label={row.maxClassification} size="sm" /> },
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-4 w-4" /> Historical Vortex Archive
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO ARCHIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Historical Cyclone Intelligence & Research
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-decadal historical vortex tracks, maximum sustained surface winds, and minimum central pressures.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-[#060b19] border border-slate-800 rounded-2xl shadow-inner">
            <button
              onClick={() => setTimeZone('UTC')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                timeZone === 'UTC' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm' : 'bg-transparent text-slate-400 border-transparent hover:text-white'
              }`}
            >
              UTC
            </button>
            <button
              onClick={() => setTimeZone('IST')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                timeZone === 'IST' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm' : 'bg-transparent text-slate-400 border-transparent hover:text-white'
              }`}
            >
              IST (UTC+5:30)
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-5 rounded-3xl bg-[#091126] border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Search Vortex</label>
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cyclone name..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Season Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Seasons</option>
              <option value="2023">2023 Season</option>
              <option value="2021">2021 Season</option>
              <option value="2020">2020 Season</option>
              <option value="2019">2019 Season</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Basin Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Ocean Basins</option>
              <option value="Bay of Bengal">Bay of Bengal</option>
              <option value="Arabian Sea">Arabian Sea</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1.5">Active Timezone</label>
            <div className="p-2 text-xs font-mono text-cyan-300 bg-[#060b19] border border-slate-800 rounded-xl font-bold flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>{timeZone} Timezone Active</span>
            </div>
          </div>
        </div>

        {/* Historical Table */}
        <DataTable columns={columns} data={filtered} emptyMessage="No historical archive records found matching filter criteria." />

        {/* Archive Record Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-xl p-6 rounded-3xl bg-[#091126] border border-cyan-500/40 space-y-4 shadow-2xl relative font-mono text-xs">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">{selectedRecord.year} HISTORICAL ARCHIVE</span>
              </div>

              <h3 className="text-xl font-black text-white">{selectedRecord.cycloneName}</h3>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#060b19] border border-slate-800 text-slate-300">
                <p>Ocean Basin: <strong className="text-white">{selectedRecord.region}</strong></p>
                <p>Duration: <strong className="text-white">{selectedRecord.durationDays} days</strong></p>
                <p>Peak Wind Speed: <strong className="text-cyan-300">{selectedRecord.peakWindKmH} km/h ({selectedRecord.peakWindKt} kt)</strong></p>
                <p>Minimum Pressure: <strong className="text-teal-300">{selectedRecord.minPressureHpa} hPa</strong></p>
                <p>Observation Period: <strong className="text-white">{selectedRecord.startDate} to {selectedRecord.endDate}</strong></p>
                <p>Landfall Location: <strong className="text-amber-300">{selectedRecord.landfallLocation || 'Open Ocean Decay'}</strong></p>
                <p className="col-span-2">Observations Archived: <strong className="text-cyan-400">{selectedRecord.observationsCount} orbital records</strong></p>
              </div>

              <p className="text-slate-300 italic p-3 rounded-xl bg-[#060b19]/60 border border-slate-800">
                &quot;{selectedRecord.aiAnalysisSummary}&quot;
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <HistoryContent />
    </ProtectedRoute>
  );
}
