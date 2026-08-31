'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import { History } from 'lucide-react';

function HistoricalDataContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Historical Track & Satellite Dataset Manager</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Query and export historical tropical cyclone track files and satellite sensor archives.
          </p>
        </div>

        <EmptyState
          title="No dataset records available."
          description="Historical observation archives awaiting database connection."
          icon={History}
        />
      </div>
    </DashboardLayout>
  );
}

export default function HistoricalDataPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <HistoricalDataContent />
    </ProtectedRoute>
  );
}
