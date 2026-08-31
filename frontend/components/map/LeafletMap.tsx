'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_CYCLONES, MockCyclone } from '@/lib/mock/cycloneMock';
import { MOCK_FORECASTS } from '@/lib/mock/forecastMock';
import { Globe, ZoomIn, ZoomOut, RotateCcw, Play, Pause } from 'lucide-react';

interface LeafletMapProps {
  height?: string;
  showTitle?: boolean;
  onSelectCyclone?: (id: string) => void;
}

export default function LeafletMap({
  height = 'h-[500px]',
  showTitle = true,
  onSelectCyclone,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeBaseMap, setActiveBaseMap] = useState<'DARK' | 'SATELLITE'>('DARK');
  const [layers, setLayers] = useState({
    track: true,
    forecast: true,
    risk: true,
    wind: true,
  });
  const [selectedHorizon, setSelectedHorizon] = useState<string>('NOW');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCyclone, setSelectedCyclone] = useState<MockCyclone>(MOCK_CYCLONES[0]);

  const timelineSteps = ['-12h', '-6h', 'NOW', '+6h', '+12h', '+24h', '+48h', '+72h'];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on North Indian Ocean / Bay of Bengal (15°N, 78°E)
    const map = L.map(mapContainerRef.current, {
      center: [15.0, 78.0],
      zoom: 5,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layers, Track Lines, Forecast Cones & Markers when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing vector layers
    map.eachLayer((layer) => {
      map.removeLayer(layer);
    });

    // 1. Add Tile Layer (CartoDB Dark or Esri World Imagery Satellite)
    if (activeBaseMap === 'DARK') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(map);
    }

    // Custom Icon Generator for Cyclones
    const createCycloneIcon = (c: MockCyclone) => {
      const isSelected = c.id === selectedCyclone.id;
      const color = c.status === 'ACTIVE' ? '#00b4d8' : c.status === 'DEVELOPING' ? '#38bdf8' : '#94a3b8';
      const size = isSelected ? 36 : 28;

      return L.divIcon({
        className: 'custom-cyclone-marker',
        html: `
          <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: ${color}33; border: 2px solid ${color}; animation: pulse 2s infinite;"></div>
            <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: ${color}; box-shadow: 0 0 10px ${color};"></div>
            <span style="position: absolute; top: -18px; font-family: monospace; font-size: 10px; font-weight: bold; color: #ffffff; background: #060b19cc; padding: 1px 4px; border-radius: 4px; border: 1px solid ${color}aa; white-space: nowrap;">
              ${c.name} (${c.maxWindKmH} km/h)
            </span>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    // 2. Render Risk Polygon Zones
    if (layers.risk) {
      const riskZones = [
        // North Odisha & Sundarbans
        {
          coords: [
            [21.5, 86.8],
            [22.2, 88.5],
            [21.2, 89.2],
            [20.5, 87.2],
          ] as [number, number][],
          color: '#ef4444',
          name: 'North Odisha & Bengal Surge Hazard (CRITICAL)',
        },
        // Gujarat Kutch Coast
        {
          coords: [
            [22.5, 68.2],
            [23.8, 70.5],
            [22.8, 70.8],
            [21.8, 69.0],
          ] as [number, number][],
          color: '#f59e0b',
          name: 'Kutch Coastal Squall Zone (MODERATE)',
        },
      ];

      riskZones.forEach((rz) => {
        L.polygon(rz.coords, {
          color: rz.color,
          fillColor: rz.color,
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '4, 4',
        })
          .addTo(map)
          .bindTooltip(rz.name, { sticky: true });
      });
    }

    // 3. Render Cyclone Tracks & Forecast Cones
    MOCK_CYCLONES.forEach((c) => {
      // Add Cyclone Marker
      const marker = L.marker([c.latitude, c.longitude], {
        icon: createCycloneIcon(c),
      }).addTo(map);

      marker.on('click', () => {
        setSelectedCyclone(c);
        if (onSelectCyclone) onSelectCyclone(c.id);
      });

      // Bind Rich Popup
      const popupContent = `
        <div style="font-family: monospace; padding: 4px; color: #ffffff; background: #091126; border-radius: 8px;">
          <div style="font-weight: bold; font-size: 13px; color: #38bdf8; margin-bottom: 4px;">${c.name}</div>
          <div style="font-size: 11px; color: #cbd5e1;">Class: <strong>${c.classification}</strong></div>
          <div style="font-size: 11px; color: #cbd5e1;">Max Wind: <strong>${c.maxWindKmH} km/h (${c.maxWindKt} kt)</strong></div>
          <div style="font-size: 11px; color: #cbd5e1;">Pressure: <strong>${c.centralPressureHpa} hPa</strong></div>
          <div style="font-size: 11px; color: #cbd5e1;">Vector: <strong>${c.movementDirection} @ ${c.movementSpeedKmH} km/h</strong></div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 4px; text-align: right;">${c.lastObservation}</div>
        </div>
      `;
      marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });

      const fc = MOCK_FORECASTS[c.id];
      if (fc && fc.points && fc.points.length > 0) {
        const latLngs: [number, number][] = fc.points.map((p) => [p.latitude, p.longitude]);

        // Historical & Forecast Track Polyline
        if (layers.track) {
          L.polyline(latLngs, {
            color: '#00b4d8',
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);

          // Add Forecast Points Dots
          fc.points.forEach((p) => {
            L.circleMarker([p.latitude, p.longitude], {
              radius: 4,
              color: '#38bdf8',
              fillColor: '#060b19',
              fillOpacity: 1,
              weight: 2,
            })
              .addTo(map)
              .bindTooltip(`${p.timeHorizon}: ${p.windSpeedKmH} km/h (${p.classification})`);
          });
        }

        // Render Uncertainty Cone Envelope
        if (layers.forecast && latLngs.length > 2) {
          const coneOffsetLat = 0.6;
          const coneOffsetLon = 0.6;
          const lastPt = latLngs[latLngs.length - 1];
          const coneCoords: [number, number][] = [
            latLngs[0],
            [lastPt[0] + coneOffsetLat, lastPt[1] - coneOffsetLon],
            [lastPt[0] + coneOffsetLat * 1.5, lastPt[1] + coneOffsetLon * 1.5],
            [lastPt[0] - coneOffsetLat, lastPt[1] + coneOffsetLon],
            latLngs[0],
          ];

          L.polygon(coneCoords, {
            color: '#f59e0b',
            fillColor: '#f59e0b',
            fillOpacity: 0.15,
            weight: 1,
            dashArray: '3, 3',
          }).addTo(map);
        }
      }
    });
  }, [activeBaseMap, layers, selectedCyclone, onSelectCyclone]);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => mapInstanceRef.current?.setView([15.0, 78.0], 5);

  return (
    <div className={`relative w-full ${height} rounded-3xl bg-[#050917] border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-2xl select-none`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 z-[400] relative">
        {showTitle && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091024]/90 border border-slate-800 backdrop-blur-md text-xs font-mono font-bold text-white uppercase tracking-wider">
            <Globe className="h-4 w-4 text-cyan-400" />
            <span>North Indian Ocean Basin GIS</span>
          </div>
        )}

        {/* Map Type & Layer Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-[#091024]/90 border border-slate-800 rounded-xl mr-2">
            <button
              onClick={() => setActiveBaseMap('DARK')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                activeBaseMap === 'DARK' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              DARK VECTOR
            </button>
            <button
              onClick={() => setActiveBaseMap('SATELLITE')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                activeBaseMap === 'SATELLITE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              SATELLITE TILES
            </button>
          </div>

          {(Object.keys(layers) as (keyof typeof layers)[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                layers[key]
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#091024]/80 text-slate-500 border border-slate-800'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-10 w-full h-full" />

      {/* Selected Cyclone Info Overlay Card */}
      {selectedCyclone && (
        <div className="absolute top-20 left-6 z-[400] p-4 rounded-2xl bg-[#091126]/90 border border-cyan-500/40 backdrop-blur-md space-y-2 max-w-xs shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono">{selectedCyclone.name}</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {selectedCyclone.classification}
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-300 space-y-1">
            <p>Wind Speed: <span className="text-cyan-300 font-bold">{selectedCyclone.maxWindKmH} km/h</span> ({selectedCyclone.maxWindKt} kt)</p>
            <p>Central Pressure: <span className="text-teal-300 font-bold">{selectedCyclone.centralPressureHpa} hPa</span></p>
            <p>Vector: {selectedCyclone.movementDirection} @ {selectedCyclone.movementSpeedKmH} km/h</p>
            <p className="text-[9px] text-slate-400 pt-1">Location: {selectedCyclone.latitude}°N, {selectedCyclone.longitude}°E</p>
          </div>

          <a
            href={`/user/cyclones/${selectedCyclone.id}`}
            onClick={(e) => {
              if (onSelectCyclone) {
                e.preventDefault();
                onSelectCyclone(selectedCyclone.id);
              }
            }}
            className="block w-full text-center py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40 transition-colors"
          >
            VIEW CYCLONE DETAILS →
          </a>
        </div>
      )}

      {/* Timeline Controls */}
      <div className="z-[400] relative bg-[#091024]/90 border border-slate-800 rounded-xl p-2 max-w-xl mx-auto flex items-center justify-between gap-2 backdrop-blur-md shadow-xl w-full">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>

        <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center">
          {timelineSteps.map((step) => (
            <button
              key={step}
              onClick={() => setSelectedHorizon(step)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                selectedHorizon === step
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {step}
            </button>
          ))}
        </div>

        <span className="text-[10px] font-mono text-cyan-400 px-2 font-bold hidden sm:inline">
          {selectedHorizon} Horizon
        </span>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between z-[400] relative pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-[#091024]/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-[#091024]/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#091024]/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-[#091024]/80 px-3 py-1 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Track</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Cone</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Risk Zone</span>
        </div>
      </div>
    </div>
  );
}
