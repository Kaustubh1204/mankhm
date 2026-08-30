'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MapPanel from '@/components/map/MapPanel';

function AdminLiveTrackingContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Live Vortex Tracking Console</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Realtime GIS stream ingestion, radar track overlays, and observation timestamps.
          </p>
        </div>

        <MapPanel height="h-[calc(100vh-220px)]" showTitle={false} />
      </div>
    </DashboardLayout>
  );
}

export default function AdminLiveTrackingPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminLiveTrackingContent />
    </ProtectedRoute>
  );
}
