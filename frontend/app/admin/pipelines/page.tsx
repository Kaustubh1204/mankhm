'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { ArrowRight, Layers } from 'lucide-react';

function PipelinesContent() {
  const stages = [
    'DATA SOURCES',
    'REALTIME / BATCH',
    'KAFKA RAW TOPIC',
    'COLLECTOR',
    'VALIDATION',
    'DATA REDUCTION',
    'PREPROCESSING',
    'ML ENGINE',
    'DATABASE',
    'API',
    'FRONTEND',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">End-to-End Pipeline Architecture Monitor</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            End-to-end data flow telemetry from orbital satellite ingestion down to user interface rendering.
          </p>
        </div>

        {/* Visual Pipeline Flow Diagram */}
        <div className="p-8 rounded-3xl bg-[#091024] border border-blue-500/30 space-y-6">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Architecture Node Topology</span>
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-3 py-6 border-y border-slate-800/80">
            {stages.map((stg, idx) => (
              <React.Fragment key={stg}>
                <div className="p-3.5 rounded-xl bg-[#060b19] border border-slate-800 text-center space-y-1.5 shadow-md">
                  <span className="text-[10px] font-mono text-slate-500 block">STAGE 0{idx + 1}</span>
                  <span className="text-xs font-mono font-bold text-white block">{stg}</span>
                  <StatusBadge status="OFFLINE" size="sm" label="AWAITING STREAM" />
                </div>
                {idx < stages.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-600 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400">
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Total Pipeline Latency</span>
              <span className="text-white font-bold text-base">-- ms</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Kafka Ingestion Topics</span>
              <span className="text-white font-bold text-base">-- topics</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">ML Worker Nodes</span>
              <span className="text-white font-bold text-base">-- active</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PipelinesPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <PipelinesContent />
    </ProtectedRoute>
  );
}
