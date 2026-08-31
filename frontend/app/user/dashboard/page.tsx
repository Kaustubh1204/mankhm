'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import CycloneMapLibre from '@/components/map/CycloneMapLibre';
import CurrentCyclonePanel from '@/components/user-dashboard/CurrentCyclonePanel';
import RightIntelligencePanel from '@/components/user-dashboard/RightIntelligencePanel';
import ForecastTimelineStrip from '@/components/user-dashboard/ForecastTimelineStrip';
import MapControls from '@/components/map/MapControls';
import MapLayers from '@/components/map/MapLayers';
import MapLegend from '@/components/map/MapLegend';

function UserDashboardMapFirst() {
  const [layersDrawerOpen, setLayersDrawerOpen] = useState(false);

  return (
    <UserDashboardLayout fullScreenMap={true}>
      <div className="w-full h-full relative overflow-hidden select-none">
        {/* Flagship 100vw x 100vh MapLibre GL GIS Engine */}
        <CycloneMapLibre className="w-full h-full absolute inset-0 z-0" />

        {/* Floating Top-Left Current Cyclone Panel */}
        <div className="absolute left-4 lg:left-24 top-20 z-30 pointer-events-none">
          <CurrentCyclonePanel className="pointer-events-auto shadow-2xl" />
        </div>

        {/* Floating Top-Right AI Intelligence & Risk Panel */}
        <div className="hidden md:block absolute right-4 top-20 z-30 pointer-events-none">
          <RightIntelligencePanel className="pointer-events-auto shadow-2xl" />
        </div>

        {/* Floating Map Controls & Quick Presets (Smartly Placed) */}
        <div className="absolute right-4 bottom-32 z-30">
          <MapControls onToggleLayers={() => setLayersDrawerOpen(!layersDrawerOpen)} />
        </div>

        {/* Floating Meteorological Legend (Bottom-Left above Timeline) */}
        <div className="hidden sm:block absolute left-4 lg:left-24 bottom-32 z-30">
          <MapLegend />
        </div>

        {/* Floating Layers Popover Drawer */}
        {layersDrawerOpen && (
          <div className="absolute right-16 bottom-32 z-40 animate-in fade-in zoom-in-95 duration-150">
            <MapLayers onClose={() => setLayersDrawerOpen(false)} />
          </div>
        )}

        {/* Floating Bottom Forecast Timeline Strip */}
        <div className="absolute left-4 lg:left-24 right-4 bottom-4 z-30 pointer-events-none">
          <ForecastTimelineStrip className="pointer-events-auto shadow-2xl" />
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <UserDashboardMapFirst />
    </ProtectedRoute>
  );
}
