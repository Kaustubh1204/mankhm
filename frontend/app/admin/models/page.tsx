'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { modelApi, MLModel } from '@/lib/api/modelApi';
import { Cpu } from 'lucide-react';

function ModelsContent() {
  const [models, setModels] = useState<MLModel[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await modelApi.getModels();
      setModels(res.data || []);
    }
    loadData();
  }, []);

  const columns: Column<MLModel>[] = [
    { header: 'Model Name', accessorKey: 'name', cell: (row) => <span className="font-bold text-white font-mono">{row.name}</span> },
    { header: 'Version', accessorKey: 'version', cell: (row) => <span className="font-mono text-cyan-300">v{row.version}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Last Inference', accessorKey: 'lastInference', cell: (row) => row.lastInference || '--' },
    { header: 'Latency (ms)', accessorKey: 'inferenceLatencyMs', cell: (row) => row.inferenceLatencyMs !== null ? `${row.inferenceLatencyMs} ms` : '--' },
    { header: 'Accuracy', accessorKey: 'accuracy', cell: (row) => row.accuracy !== null ? `${row.accuracy}%` : '--' },
    { header: 'F1 Score', accessorKey: 'f1Score', cell: (row) => row.f1Score !== null ? row.f1Score : '--' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Deep Learning Model Registry & Explainability</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Model versioning, inference latency, accuracy metrics, and Grad-CAM attention explainability outputs.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={models}
          emptyMessage="No ML models currently registered in model registry."
        />

        {/* Explainability Section */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span>AI Model Explainability & Attention Maps</span>
          </h3>

          <EmptyState
            title="Explainability output unavailable."
            description="Grad-CAM cloud attention maps & feature importance weights will display when backend inference runs."
            icon={Cpu}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ModelsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <ModelsContent />
    </ProtectedRoute>
  );
}
