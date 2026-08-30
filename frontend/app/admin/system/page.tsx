'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { systemApi, SystemNodeHealth } from '@/lib/api/systemApi';

function SystemContent() {
  const [nodes, setNodes] = useState<SystemNodeHealth[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await systemApi.getSystemHealth();
      setNodes(res.data || []);
    }
    loadData();
  }, []);

  const columns: Column<SystemNodeHealth>[] = [
    { header: 'Node Name', accessorKey: 'name', cell: (row) => <span className="font-bold text-white font-mono">{row.name}</span> },
    { header: 'CPU Load', accessorKey: 'cpuPercent', cell: (row) => row.cpuPercent !== null ? `${row.cpuPercent}%` : '--' },
    { header: 'Memory Usage', accessorKey: 'memoryPercent', cell: (row) => row.memoryPercent !== null ? `${row.memoryPercent}%` : '--' },
    { header: 'GPU Usage', accessorKey: 'gpuPercent', cell: (row) => row.gpuPercent !== null ? `${row.gpuPercent}%` : '--' },
    { header: 'Storage Load', accessorKey: 'storagePercent', cell: (row) => row.storagePercent !== null ? `${row.storagePercent}%` : '--' },
    { header: 'Node Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System Node Hardware & Infrastructure Health</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Realtime CPU, Memory, GPU, Storage, and API server hardware monitoring.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={nodes}
          emptyMessage="No infrastructure nodes currently reporting health metrics."
        />
      </div>
    </DashboardLayout>
  );
}

export default function SystemPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <SystemContent />
    </ProtectedRoute>
  );
}
