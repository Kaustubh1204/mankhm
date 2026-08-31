'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import CycloneMapLibre from '@/components/map/CycloneMapLibre';
import CurrentCyclonePanel from '@/components/user-dashboard/CurrentCyclonePanel';
import ForecastTimelineStrip from '@/components/user-dashboard/ForecastTimelineStrip';
import MapControls from '@/components/map/MapControls';
import MapLayers from '@/components/map/MapLayers';
import MapLegend from '@/components/map/MapLegend';

function LiveMapContent() {
  const [layersOpen, setLayersOpen] = useState(true);

  return (
    <UserDashboardLayout fullScreenMap={true}>
      <div className="w-full h-full relative overflow-hidden select-none">
        {/* Full-Screen GIS Engine */}
        <CycloneMapLibre className="w-full h-full absolute inset-0 z-0" />

        {/* Floating Top-Left Cyclone Info Panel */}
        <div className="absolute left-4 lg:left-24 top-20 z-30 pointer-events-none">
          <CurrentCyclonePanel className="pointer-events-auto shadow-2xl" />
        </div>

        {/* Floating Layer Control Panel on Right */}
        {layersOpen && (
          <div className="hidden sm:block absolute right-4 top-20 z-30 pointer-events-none animate-in fade-in duration-200">
            <MapLayers onClose={() => setLayersOpen(false)} />
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute right-4 bottom-32 z-30">
          <MapControls onToggleLayers={() => setLayersOpen(!layersOpen)} />
        </div>

        {/* Meteorological Map Legend */}
        <div className="hidden sm:block absolute left-4 lg:left-24 bottom-32 z-30">
          <MapLegend />
        </div>

        {/* Floating Bottom Forecast Timeline */}
        <div className="absolute left-4 lg:left-24 right-4 bottom-4 z-30 pointer-events-none">
          <ForecastTimelineStrip className="pointer-events-auto shadow-2xl" />
        </div>
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
