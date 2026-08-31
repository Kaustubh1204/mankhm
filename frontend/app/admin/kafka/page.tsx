'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { pipelineApi, KafkaTopic } from '@/lib/api/pipelineApi';

function KafkaContent() {
  const [topics, setTopics] = useState<KafkaTopic[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await pipelineApi.getKafkaTopics();
      setTopics(res.data || []);
    }
    loadData();
  }, []);

  const columns: Column<KafkaTopic>[] = [
    { header: 'Topic Name', accessorKey: 'name', cell: (row) => <span className="font-bold text-white font-mono">{row.name}</span> },
    { header: 'Partitions', accessorKey: 'partitions', cell: (row) => row.partitions !== null ? row.partitions : '--' },
    { header: 'Producer Rate (msg/s)', accessorKey: 'producerRate', cell: (row) => row.producerRate !== null ? `${row.producerRate}/s` : '--' },
    { header: 'Consumer Rate (msg/s)', accessorKey: 'consumerRate', cell: (row) => row.consumerRate !== null ? `${row.consumerRate}/s` : '--' },
    { header: 'Consumer Lag', accessorKey: 'lag', cell: (row) => row.lag !== null ? row.lag : '--' },
    { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Kafka Message Broker Telemetry</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Realtime topic throughput, producer/consumer rates, and partition lag monitoring via Backend Monitoring API.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={topics}
          emptyMessage="Kafka monitoring unavailable. Connect backend Kafka monitoring service."
        />
      </div>
    </DashboardLayout>
  );
}

export default function KafkaPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <KafkaContent />
    </ProtectedRoute>
  );
}
