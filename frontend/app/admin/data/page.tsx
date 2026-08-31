'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { ArrowRight, Layers } from 'lucide-react';

function DataProcessingContent() {
  const steps = [
    'RAW INGESTION',
    'VALIDATION',
    'DEDUPLICATION',
    'FILTERING',
    'PROCESSING',
    'ML READY',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Data Processing & Reduction Pipeline</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Visual tracking of raw payload validation, deduplication, filtering, and reduction metrics.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#091024] border border-slate-800 space-y-6">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Processing Flow Topology</span>
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-3 py-6 border-y border-slate-800">
            {steps.map((s, idx) => (
              <React.Fragment key={s}>
                <div className="p-3.5 rounded-xl bg-[#060b19] border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 block">STEP 0{idx + 1}</span>
                  <span className="text-xs font-mono font-bold text-white block">{s}</span>
                  <StatusBadge status="OFFLINE" size="sm" />
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-600 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-400">
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Raw Payload Volume</span>
              <span className="text-white font-bold text-base">-- MB</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Deduplicated Records</span>
              <span className="text-white font-bold text-base">--</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">ML Input Volume</span>
              <span className="text-white font-bold text-base">-- MB</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Data Reduction Ratio</span>
              <span className="text-white font-bold text-base">-- %</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DataProcessingPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DataProcessingContent />
    </ProtectedRoute>
  );
}
