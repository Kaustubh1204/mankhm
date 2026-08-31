'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import { Radio } from 'lucide-react';

function RealtimeContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Realtime Pipeline Monitor (~15 min target)</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Latency breakdown for Satellite fetch, Kafka, Collector, ML inference, and End-to-End delivery.
          </p>
        </div>

        <EmptyState
          title="No realtime ingestion telemetry."
          description="Realtime 15-minute pipeline monitoring feeds awaiting backend telemetry connection."
          icon={Radio}
        />
      </div>
    </DashboardLayout>
  );
}

export default function RealtimePage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <RealtimeContent />
    </ProtectedRoute>
  );
}
