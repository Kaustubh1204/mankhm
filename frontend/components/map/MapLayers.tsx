'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { SatelliteSensorType } from '@/types/cyclone';
import { Layers, Eye, EyeOff, Radio, CloudRain, Wind, Waves, ShieldAlert, X } from 'lucide-react';

interface MapLayersProps {
  onClose?: () => void;
}

export default function MapLayers({ onClose }: MapLayersProps) {
  const {
    layers,
    toggleLayer,
    activeBaseMap,
    setActiveBaseMap,
    activeSatelliteType,
    setActiveSatelliteType,
  } = useDashboard();

  const satelliteTypes: { type: SatelliteSensorType; label: string; desc: string }[] = [
    { type: 'VISIBLE', label: 'Visible 0.65µm', desc: 'Optical cloud reflectance' },
    { type: 'INFRARED', label: 'Infrared 10.8µm', desc: 'Cloud-top temperature gradient' },
    { type: 'WATER_VAPOR', label: 'Water Vapor 6.7µm', desc: 'Tropospheric moisture flux' },
    { type: 'MICROWAVE', label: 'Microwave 89GHz', desc: 'Low-level eyewall structure' },
  ];

  return (
    <div className="w-80 rounded-3xl bg-[#091126]/95 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-2xl space-y-5 text-xs font-mono select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Meteorological GIS Layers</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Base Map Switcher */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Base Cartography</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveBaseMap('dark-vector')}
            className={`py-1.5 px-3 rounded-xl font-bold transition-all border ${
              activeBaseMap === 'dark-vector'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Dark Vector
          </button>
          <button
            onClick={() => setActiveBaseMap('satellite-tiles')}
            className={`py-1.5 px-3 rounded-xl font-bold transition-all border ${
              activeBaseMap === 'satellite-tiles'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Satellite Imagery
          </button>
        </div>
      </div>

      {/* Category 1: OBSERVATION */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <Radio className="h-3 w-3 text-cyan-400" /> Observation
        </span>
        <div className="space-y-1 bg-[#060b19] p-2 rounded-2xl border border-slate-800">
          <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer">
            <span className="text-slate-300">Observed Vortex Track</span>
            <button
              onClick={() => toggleLayer('observedTrack')}
              className={`p-1 rounded-md ${layers.observedTrack ? 'text-cyan-400' : 'text-slate-600'}`}
            >
              {layers.observedTrack ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </label>
        </div>
      </div>

      {/* Category 2: FORECAST */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <Wind className="h-3 w-3 text-cyan-400" /> Forecast Ensemble
        </span>
        <div className="space-y-1 bg-[#060b19] p-2 rounded-2xl border border-slate-800">
          <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer">
            <span className="text-slate-300">72h Predicted Trajectory</span>
            <button
              onClick={() => toggleLayer('forecastTrack')}
              className={`p-1 rounded-md ${layers.forecastTrack ? 'text-cyan-400' : 'text-slate-600'}`}
            >
              {layers.forecastTrack ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </label>
          <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer">
            <span className="text-slate-300">Uncertainty Cone Envelope</span>
            <button
              onClick={() => toggleLayer('forecastCone')}
              className={`p-1 rounded-md ${layers.forecastCone ? 'text-amber-400' : 'text-slate-600'}`}
            >
              {layers.forecastCone ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </label>
        </div>
      </div>

      {/* Category 3: RISK & SURGE */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="h-3 w-3 text-red-400" /> Hazard & Risk Assessment
        </span>
        <div className="space-y-1 bg-[#060b19] p-2 rounded-2xl border border-slate-800">
          <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer">
            <span className="text-slate-300">Coastal Inundation Zones</span>
            <button
              onClick={() => toggleLayer('riskZones')}
              className={`p-1 rounded-md ${layers.riskZones ? 'text-red-400' : 'text-slate-600'}`}
            >
              {layers.riskZones ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </label>
          <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer">
            <span className="text-slate-300">Storm Surge Hazard Level</span>
            <button
              onClick={() => toggleLayer('coastalRisk')}
              className={`p-1 rounded-md ${layers.coastalRisk ? 'text-cyan-400' : 'text-slate-600'}`}
            >
              {layers.coastalRisk ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </label>
        </div>
      </div>

      {/* Category 4: SATELLITE SENSORS */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <CloudRain className="h-3 w-3 text-teal-400" /> Satellite Channels (DEMO)
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {satelliteTypes.map((st) => (
            <button
              key={st.type}
              onClick={() => setActiveSatelliteType(st.type)}
              className={`p-2 rounded-xl text-left transition-all border ${
                activeSatelliteType === st.type
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <div className="font-bold text-[10px]">{st.label}</div>
              <div className="text-[8px] text-slate-500 truncate">{st.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
