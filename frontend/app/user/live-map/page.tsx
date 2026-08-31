'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import MapPanel from '@/components/map/MapPanel';

function LiveMapContent() {
  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Live GIS Map Monitor</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Multi-layered spatial visualization for North Indian Ocean, Bay of Bengal, and Arabian Sea basins.
            </p>
          </div>
        </div>

        <MapPanel height="h-[calc(100vh-220px)]" showTitle={false} />
      </div>
    </UserDashboardLayout>
  );
}

export default function LiveMapPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <LiveMapContent />
    </ProtectedRoute>
  );
}
