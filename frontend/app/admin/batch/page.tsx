'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import { Database } from 'lucide-react';

function BatchContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Batch Pipeline Monitor (~6 hr target)</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Historical synoptic observations, data reduction, and 6-hour batch cycle statistics.
          </p>
        </div>

        <EmptyState
          title="No batch pipeline run statistics."
          description="Batch execution records will populate after next scheduled batch cycle."
          icon={Database}
        />
      </div>
    </DashboardLayout>
  );
}

export default function BatchPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <BatchContent />
    </ProtectedRoute>
  );
}
