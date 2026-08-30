'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useHistoricalData } from '@/hooks/useCycloneData';
import { HistoricalRecord } from '@/lib/mock/historyMock';
import { History, Search, X } from 'lucide-react';

function HistoryContent() {
  const { records } = useHistoricalData();
  const [timeZone, setTimeZone] = useState<'UTC' | 'IST'>('UTC');
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HistoricalRecord | null>(null);

  const filtered = records.filter((r) => {
    if (yearFilter !== 'ALL' && String(r.year) !== yearFilter) return false;
    if (regionFilter !== 'ALL' && r.region !== regionFilter) return false;
    if (search && !r.cycloneName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<HistoricalRecord>[] = [
    { header: 'Cyclone Name', accessorKey: 'cycloneName', cell: (row) => (
      <button
        onClick={() => setSelectedRecord(row)}
        className="font-bold text-white hover:text-cyan-400 font-mono text-left"
      >
        {row.cycloneName}
      </button>
    )},
    { header: 'Region', accessorKey: 'region' },
    { header: 'Season Year', accessorKey: 'year', cell: (row) => <span className="font-mono text-cyan-300">{row.year}</span> },
    { header: 'Start Date', accessorKey: 'startDate' },
    { header: 'End Date', accessorKey: 'endDate' },
    { header: 'Peak Wind', accessorKey: 'peakWindKmH', cell: (row) => `${row.peakWindKmH} km/h (${row.peakWindKt} kt)` },
    { header: 'Min Pressure', accessorKey: 'minPressureHpa', cell: (row) => `${row.minPressureHpa} hPa` },
    { header: 'Duration', accessorKey: 'durationDays', cell: (row) => `${row.durationDays} days` },
    { header: 'Max Classification', accessorKey: 'maxClassification', cell: (row) => <StatusBadge status="ACTIVE" label={row.maxClassification} size="sm" /> },
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <History className="h-6 w-6 text-cyan-400" />
              <span>Historical Cyclone Research Archive</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO ARCHIVE
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Historical vortex tracks, pressure charts, and satellite dataset queries.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#091024] border border-slate-800 rounded-xl">
            <button
              onClick={() => setTimeZone('UTC')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                timeZone === 'UTC' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              UTC
            </button>
            <button
              onClick={() => setTimeZone('IST')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                timeZone === 'IST' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              IST (UTC+5:30)
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Search Name</label>
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cyclone..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Season Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Years</option>
              <option value="2023">2023</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Region / Basin</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Basins</option>
              <option value="Bay of Bengal">Bay of Bengal</option>
              <option value="Arabian Sea">Arabian Sea</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Timezone Display</label>
            <div className="p-2 text-xs font-mono text-cyan-300 bg-[#060b19] border border-slate-800 rounded-xl font-bold">
              {timeZone} Timezone Active
            </div>
          </div>
        </div>

        {/* Historical Table */}
        <DataTable columns={columns} data={filtered} emptyMessage="No historical archive records found matching filter criteria." />

        {/* Historical Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-xl p-6 rounded-3xl bg-[#091126] border border-cyan-500/40 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedRecord.year} HISTORICAL RECORD</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white">{selectedRecord.cycloneName}</h3>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#060b19] border border-slate-800 text-xs font-mono text-slate-300">
                <p>Basin Region: <strong className="text-white">{selectedRecord.region}</strong></p>
                <p>Duration: <strong className="text-white">{selectedRecord.durationDays} days</strong></p>
                <p>Peak Surface Wind: <strong className="text-cyan-300">{selectedRecord.peakWindKmH} km/h ({selectedRecord.peakWindKt} kt)</strong></p>
                <p>Minimum Pressure: <strong className="text-teal-300">{selectedRecord.minPressureHpa} hPa</strong></p>
                <p>Start Date: <strong className="text-white">{selectedRecord.startDate}</strong></p>
                <p>End Date: <strong className="text-white">{selectedRecord.endDate}</strong></p>
                <p className="col-span-2">Observations Archived: <strong className="text-white">{selectedRecord.observationsCount} orbital records</strong></p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold"
                >
                  Close Archive Record
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
