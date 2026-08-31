'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { systemApi, SystemLog } from '@/lib/api/systemApi';

function LogsContent() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      const res = await systemApi.getLogs();
      setLogs(res.data || []);
    }
    loadData();
  }, []);

  const filtered = logs.filter((l) => {
    if (levelFilter !== 'ALL' && l.level !== levelFilter) return false;
    return true;
  });

  const columns: Column<SystemLog>[] = [
    { header: 'Timestamp (UTC)', accessorKey: 'timestamp', cell: (row) => <span className="font-mono text-slate-400">{row.timestamp}</span> },
    { header: 'Service Node', accessorKey: 'service', cell: (row) => <span className="font-mono font-bold text-white">{row.service}</span> },
    { header: 'Severity Level', accessorKey: 'level', cell: (row) => <StatusBadge status={row.level} size="sm" /> },
    { header: 'Log Message Payload', accessorKey: 'message', cell: (row) => <span className="font-mono text-xs text-slate-300">{row.message}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Operational System Log Viewer</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Realtime log stream for Ingestion, Kafka, Collector, Processing, ML, API, and Database services.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#091024] border border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-400 mr-2">Severity Level:</span>
          {(['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No operational log entries recorded."
        />
      </div>
    </DashboardLayout>
  );
}

export default function LogsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <LogsContent />
    </ProtectedRoute>
  );
}
