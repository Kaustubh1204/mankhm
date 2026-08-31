'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import EmptyState from '@/components/dashboard/EmptyState';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { telemetryApi, TelemetrySource } from '@/lib/api/telemetryApi';
import { pipelineApi, PipelineStage } from '@/lib/api/pipelineApi';
import { modelApi, MLModel } from '@/lib/api/modelApi';
import { ShieldCheck, Activity, Layers, Cpu, Server } from 'lucide-react';

import { StorageManager } from '@/components/dashboard/StorageManager';

function AdminDashboardOverview() {
  const [telemetry, setTelemetry] = useState<TelemetrySource[]>([]);
  const [pipelines, setPipelines] = useState<PipelineStage[]>([]);
  const [models, setModels] = useState<MLModel[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      const [telRes, pipeRes, modRes] = await Promise.all([
        telemetryApi.getTelemetrySources(),
        pipelineApi.getPipelineStages(),
        modelApi.getModels(),
      ]);
      setTelemetry(telRes.data || []);
      setPipelines(pipeRes.data || []);
      setModels(modRes.data || []);
    }
    loadAdminData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 select-none">
        {/* Admin Command Banner */}
        <div className="p-4 rounded-2xl bg-[#09122a] border border-blue-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">System Operations Command Center</h2>
              <p className="text-xs text-slate-400">End-to-end pipeline ingestion, Kafka streams, and ML model monitoring.</p>
            </div>
          </div>
          <StatusBadge status="ONLINE" label="PIPELINE NODE ACTIVE" />
        </div>

        {/* Cloudflare R2 Storage Quota Manager (Admin Panel Exclusive) */}
        <StorageManager />

        {/* Top Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Telemetry Sources"
            value={telemetry.length > 0 ? telemetry.length : 0}
            subtitle={telemetry.length === 0 ? 'Awaiting sources' : 'Ingestion channels'}
            icon={Activity}
            statusColor="blue"
          />
          <MetricCard
            label="Pipeline Stages"
            value={pipelines.length > 0 ? pipelines.length : 0}
            subtitle={pipelines.length === 0 ? 'Awaiting stages' : 'Architecture nodes'}
            icon={Layers}
            statusColor="cyan"
          />
          <MetricCard
            label="Active ML Models"
            value={models.length > 0 ? models.length : 0}
            subtitle={models.length === 0 ? 'Awaiting models' : 'Inference workers'}
            icon={Cpu}
            statusColor="teal"
          />
          <MetricCard
            label="Kafka Raw Topics"
            value="--"
            subtitle="Topic streams"
            icon={Server}
            statusColor="amber"
          />
        </div>

        {/* Pipeline & Telemetry Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Telemetry Sources */}
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span>Data Source Telemetry</span>
              </h3>
              <a href="/admin/telemetry" className="text-xs font-mono text-blue-400 hover:text-blue-300">
                View All →
              </a>
            </div>

            {telemetry.length === 0 ? (
              <EmptyState title="No telemetry sources active." description="Satellite, microwave, & radar streams awaiting backend payload." icon={Activity} />
            ) : (
              <div className="space-y-3">
                {telemetry.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-[#060b19] border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{t.name}</span>
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ML Models */}
          <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span>ML Model Inference Workers</span>
              </h3>
              <a href="/admin/models" className="text-xs font-mono text-blue-400 hover:text-blue-300">
                Registry →
              </a>
            </div>

            {models.length === 0 ? (
              <EmptyState title="No ML models connected." description="Vortex intensity & track prediction models awaiting service deployment." icon={Cpu} />
            ) : (
              <div className="space-y-3">
                {models.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-[#060b19] border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-white block">{m.name}</span>
                      <span className="text-[10px] text-slate-500">v{m.version}</span>
                    </div>
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboardOverview />
    </ProtectedRoute>
  );
}
