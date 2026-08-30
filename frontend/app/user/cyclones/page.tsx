'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useCyclones } from '@/hooks/useCycloneData';
import { MockCyclone } from '@/lib/mock/cycloneMock';
import { Search, ArrowUpDown } from 'lucide-react';

function CyclonesContent() {
  const { cyclones } = useCyclones();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DEVELOPING' | 'WEAKENING'>('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'INTENSITY' | 'LAST_UPDATE' | 'WIND' | 'PRESSURE'>('INTENSITY');

  const filtered = cyclones
    .filter((c) => {
      if (filter !== 'ALL' && c.status !== filter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.region.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'WIND') return b.maxWindKmH - a.maxWindKmH;
      if (sortBy === 'PRESSURE') return a.centralPressureHpa - b.centralPressureHpa;
      return b.categoryNumber - a.categoryNumber;
    });

  const columns: Column<MockCyclone>[] = [
    { header: 'System Name', accessorKey: 'name', cell: (row) => (
      <Link href={`/user/cyclones/${row.id}`} className="font-bold text-white hover:text-cyan-400 font-mono text-sm">
        {row.name}
      </Link>
    )},
    { header: 'Region', accessorKey: 'region' },
    { header: 'Classification', accessorKey: 'classification', cell: (row) => (
      <span className="font-mono text-cyan-300">{row.classification}</span>
    )},
    { header: 'Max Wind', accessorKey: 'maxWindKmH', cell: (row) => `${row.maxWindKmH} km/h (${row.maxWindKt} kt)` },
    { header: 'Central Pressure', accessorKey: 'centralPressureHpa', cell: (row) => `${row.centralPressureHpa} hPa` },
    { header: 'Position', cell: (row) => `${row.latitude}°N, ${row.longitude}°E` },
    { header: 'Movement', cell: (row) => `${row.movementDirection} @ ${row.movementSpeedKmH} km/h` },
    { header: 'Last Update', accessorKey: 'lastObservation' },
    { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Tropical Cyclone Systems</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Active, developing, and weakening tropical vortex observations across ocean basins.
            </p>
          </div>
        </div>

        {/* Filters, Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091024] border border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            {(['ALL', 'ACTIVE', 'DEVELOPING', 'WEAKENING'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'INTENSITY' | 'LAST_UPDATE' | 'WIND' | 'PRESSURE')}
                className="bg-[#060b19] border border-slate-800 rounded-lg text-xs text-white p-1"
              >
                <option value="INTENSITY">Category Intensity</option>
                <option value="WIND">Max Wind Speed</option>
                <option value="PRESSURE">Minimum Pressure</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name or region..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Cyclone Table */}
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No cyclone systems currently available matching filter criteria."
        />
      </div>
    </UserDashboardLayout>
  );
}

export default function CyclonesPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <CyclonesContent />
    </ProtectedRoute>
  );
}
