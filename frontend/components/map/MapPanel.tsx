'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Globe } from 'lucide-react';

interface MapPanelProps {
  height?: string;
  showTitle?: boolean;
  onSelectCyclone?: (id: string) => void;
}

// Dynamically import LeafletMap with SSR disabled
const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl bg-[#050917] border border-slate-800 flex flex-col items-center justify-center p-6 space-y-3 text-slate-400 font-mono text-xs">
      <Globe className="h-8 w-8 text-cyan-400 animate-spin" />
      <span>Loading Interactive Geographic Map Tiles...</span>
    </div>
  ),
});

export default function MapPanel(props: MapPanelProps) {
  return <DynamicLeafletMap {...props} />;
}
