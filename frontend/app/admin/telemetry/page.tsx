'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { telemetryApi, TelemetrySource } from '@/lib/api/telemetryApi';

function TelemetryContent() {
  const [sources, setSources] = useState<TelemetrySource[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await telemetryApi.getTelemetrySources();
      setSources(res.data || []);
    }
    loadData();
  }, []);

  const columns: Column<TelemetrySource>[] = [
    { header: 'Source Name', accessorKey: 'name', cell: (row) => <span className="font-bold text-white font-mono">{row.name}</span> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Last Received', accessorKey: 'lastReceived', cell: (row) => row.lastReceived || '--' },
    { header: 'Latency (ms)', accessorKey: 'latencyMs', cell: (row) => row.latencyMs !== null ? `${row.latencyMs} ms` : '--' },
    { header: 'Observation Timestamp', accessorKey: 'observationTimestamp', cell: (row) => row.observationTimestamp || '--' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Data Source Telemetry Monitor</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Realtime monitoring of satellite, microwave, ocean buoy, and wind scatterometer feed ingestion.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={sources}
          emptyMessage="No telemetry source feeds currently connected."
        />
      </div>
    </DashboardLayout>
  );
}

export default function TelemetryPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <TelemetryContent />
    </ProtectedRoute>
  );
}
