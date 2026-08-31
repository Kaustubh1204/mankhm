'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useDashboard } from '@/context/DashboardContext';
import { Cyclone } from '@/types/cyclone';

interface CycloneMapLibreProps {
  className?: string;
  onSelectCyclone?: (id: string) => void;
  interactive?: boolean;
}

export default function CycloneMapLibre({
  className = 'w-full h-full',
  onSelectCyclone,
  interactive = true,
}: CycloneMapLibreProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const {
    cyclones,
    selectedCycloneId,
    setSelectedCycloneId,
    selectedCyclone,
    selectedHorizon,
    layers,
    activeBaseMap,
    mapFlyTarget,
    currentForecast,
    currentRiskRegions,
  } = useDashboard();

  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const darkStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-dark': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-dark-layer',
          type: 'raster',
          source: 'osm-dark',
          minzoom: 0,
          maxzoom: 19,
          paint: {
            'raster-brightness-min': 0.08,
            'raster-brightness-max': 0.42,
            'raster-saturation': -0.85,
            'raster-contrast': 0.35,
            'raster-hue-rotate': 195,
          },
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: darkStyle,
      center: [78.0, 15.0], // North Indian Ocean (Lon, Lat)
      zoom: 4.8,
      minZoom: 3,
      maxZoom: 13,
      attributionControl: false,
      interactive: interactive,
    });

    map.on('error', () => {
      // Gracefully prevent unhandled tile network errors from interrupting UI
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, [interactive]);

  // Switch Base Map (Dark Vector vs Satellite)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (activeBaseMap === 'satellite-tiles') {
      if (map.getSource('satellite-source')) {
        map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
        if (map.getLayer('osm-dark-layer')) {
          map.setLayoutProperty('osm-dark-layer', 'visibility', 'none');
        }
      } else {
        map.addSource('satellite-source', {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
        });
        map.addLayer(
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-source',
            minzoom: 0,
            maxzoom: 19,
          },
          'tracks-layer'
        );
        if (map.getLayer('osm-dark-layer')) {
          map.setLayoutProperty('osm-dark-layer', 'visibility', 'none');
        }
      }
    } else {
      if (map.getLayer('satellite-layer')) {
        map.setLayoutProperty('satellite-layer', 'visibility', 'none');
      }
      if (map.getLayer('osm-dark-layer')) {
        map.setLayoutProperty('osm-dark-layer', 'visibility', 'visible');
      }
    }
  }, [activeBaseMap, mapLoaded]);

  // Handle programmatic camera fly-to
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !mapFlyTarget) return;

    map.flyTo({
      center: [mapFlyTarget.center[1], mapFlyTarget.center[0]], // [lon, lat]
      zoom: mapFlyTarget.zoom,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [mapFlyTarget, mapLoaded]);

  // Render Vector Tracks, Cones & Risk Polygons
  const updateVectorLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Helper to safely add or update GeoJSON Source
    const setGeoJsonSource = (sourceId: string, data: GeoJSON.FeatureCollection | GeoJSON.Feature) => {
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(data);
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: data,
        });
      }
    };

    // 1. RISK ZONES
    if (layers.riskZones && currentRiskRegions.length > 0) {
      const riskFeatures: GeoJSON.Feature[] = currentRiskRegions.map((rr) => {
        const coords = rr.coordinates.map((c) => [c[1], c[0]]); // [lon, lat]
        if (coords.length > 0) {
          coords.push(coords[0]); // Close polygon
        }
        return {
          type: 'Feature',
          properties: {
            id: rr.id,
            name: rr.regionName,
            level: rr.riskLevel,
            color: rr.riskLevel === 'CRITICAL' ? '#ef4444' : rr.riskLevel === 'HIGH' ? '#f97316' : '#eab308',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
        };
      });

      setGeoJsonSource('risk-zones-src', {
        type: 'FeatureCollection',
        features: riskFeatures,
      });

      if (!map.getLayer('risk-zones-fill')) {
        map.addLayer({
          id: 'risk-zones-fill',
          type: 'fill',
          source: 'risk-zones-src',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.18,
          },
        });
        map.addLayer({
          id: 'risk-zones-line',
          type: 'line',
          source: 'risk-zones-src',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 1.5,
            'line-dasharray': [3, 2],
          },
        });
      }
    } else {
      if (map.getLayer('risk-zones-fill')) map.removeLayer('risk-zones-fill');
      if (map.getLayer('risk-zones-line')) map.removeLayer('risk-zones-line');
    }

    // 2. FORECAST CONE (Uncertainty Corridor) for selected cyclone
    if (layers.forecastCone && currentForecast && currentForecast.points.length > 2) {
      const pts = currentForecast.points;
      const leftCoords: [number, number][] = [];
      const rightCoords: [number, number][] = [];

      pts.forEach((p, idx) => {
        const spread = Math.max(0.2, (idx * 0.45)); // Expansion with lead time
        leftCoords.push([p.longitude - spread, p.latitude + spread * 0.3]);
        rightCoords.unshift([p.longitude + spread, p.latitude - spread * 0.3]);
      });

      const coneCoords = [...leftCoords, ...rightCoords, leftCoords[0]];

      setGeoJsonSource('forecast-cone-src', {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { id: 'cone_polygon' },
            geometry: {
              type: 'Polygon',
              coordinates: [coneCoords],
            },
          },
        ],
      });

      if (!map.getLayer('forecast-cone-fill')) {
        map.addLayer({
          id: 'forecast-cone-fill',
          type: 'fill',
          source: 'forecast-cone-src',
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.12,
          },
        });
        map.addLayer({
          id: 'forecast-cone-line',
          type: 'line',
          source: 'forecast-cone-src',
          paint: {
            'line-color': '#f59e0b',
            'line-width': 1.2,
            'line-dasharray': [4, 3],
          },
        });
      }
    } else {
      if (map.getLayer('forecast-cone-fill')) map.removeLayer('forecast-cone-fill');
      if (map.getLayer('forecast-cone-line')) map.removeLayer('forecast-cone-line');
    }

    // 3. TRACKS (Observed & Forecast Lines)
    const trackFeatures: GeoJSON.Feature[] = [];
    const pointFeatures: GeoJSON.Feature[] = [];

    cyclones.forEach((cyc) => {
      const isSelected = cyc.id === selectedCycloneId;
      const color = isSelected ? '#00b4d8' : '#64748b';

      // Observed Track Line
      if (layers.observedTrack && cyc.observedTrack && cyc.observedTrack.length > 1) {
        const obsCoords = cyc.observedTrack.map((p) => [p.longitude, p.latitude]);
        trackFeatures.push({
          type: 'Feature',
          properties: {
            type: 'observed',
            color: color,
            width: isSelected ? 3.5 : 2,
            dash: [1, 0],
          },
          geometry: {
            type: 'LineString',
            coordinates: obsCoords,
          },
        });

        // Historical node dots
        cyc.observedTrack.forEach((p) => {
          pointFeatures.push({
            type: 'Feature',
            properties: {
              cycloneId: cyc.id,
              horizon: p.timeHorizon,
              wind: p.windSpeedKmH,
              pressure: p.centralPressureHpa,
              isForecast: false,
              color: color,
            },
            geometry: {
              type: 'Point',
              coordinates: [p.longitude, p.latitude],
            },
          });
        });
      }

      // Forecast Track Line
      if (layers.forecastTrack && cyc.forecast && cyc.forecast.points && cyc.forecast.points.length > 1) {
        const fcCoords = cyc.forecast.points.map((p) => [p.longitude, p.latitude]);
        trackFeatures.push({
          type: 'Feature',
          properties: {
            type: 'forecast',
            color: isSelected ? '#38bdf8' : '#475569',
            width: isSelected ? 2.5 : 1.5,
            dash: [3, 2],
          },
          geometry: {
            type: 'LineString',
            coordinates: fcCoords,
          },
        });

        // Forecast node dots
        cyc.forecast.points.slice(1).forEach((p) => {
          pointFeatures.push({
            type: 'Feature',
            properties: {
              cycloneId: cyc.id,
              horizon: p.timeHorizon,
              wind: p.windSpeedKmH,
              pressure: p.centralPressureHpa,
              isForecast: true,
              color: '#38bdf8',
            },
            geometry: {
              type: 'Point',
              coordinates: [p.longitude, p.latitude],
            },
          });
        });
      }
    });

    setGeoJsonSource('tracks-src', {
      type: 'FeatureCollection',
      features: trackFeatures,
    });

    setGeoJsonSource('track-points-src', {
      type: 'FeatureCollection',
      features: pointFeatures,
    });

    if (!map.getLayer('tracks-line')) {
      map.addLayer({
        id: 'tracks-line',
        type: 'line',
        source: 'tracks-src',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
        },
      });
    }

    if (!map.getLayer('track-points-circle')) {
      map.addLayer({
        id: 'track-points-circle',
        type: 'circle',
        source: 'track-points-src',
        paint: {
          'circle-radius': 4.5,
          'circle-color': '#060b19',
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'color'],
        },
      });
    }
  }, [cyclones, selectedCycloneId, layers, currentForecast, currentRiskRegions, mapLoaded]);

  useEffect(() => {
    updateVectorLayers();
  }, [updateVectorLayers]);

  // Render Custom HTML Cyclone Markers with 3D Vortex Swirl & Category Badges
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove obsolete markers
    Object.keys(markersRef.current).forEach((id) => {
      if (!cyclones.some((c) => c.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    cyclones.forEach((c) => {
      const isSelected = c.id === selectedCycloneId;
      const statusColor =
        c.status === 'ACTIVE'
          ? '#00b4d8'
          : c.status === 'DEVELOPING'
          ? '#38bdf8'
          : '#94a3b8';

      // If marker already exists, update position and styling
      if (markersRef.current[c.id]) {
        markersRef.current[c.id].setLngLat([c.longitude, c.latitude]);
        const el = markersRef.current[c.id].getElement();
        if (el) {
          el.className = `cyclone-marker-container ${isSelected ? 'is-selected' : ''}`;
        }
        return;
      }

      // Create new custom marker element
      const el = document.createElement('div');
      el.className = `cyclone-marker-container ${isSelected ? 'is-selected' : ''}`;
      el.style.cursor = 'pointer';

      el.innerHTML = `
        <div class="relative flex items-center justify-center select-none" style="width: 44px; height: 44px;">
          <!-- Radar Pulse Ring -->
          <div class="absolute inset-0 rounded-full border-2 animate-ping" style="border-color: ${statusColor}; opacity: 0.35;"></div>
          <!-- Outer Swirl Ring -->
          <div class="absolute inset-1 rounded-full border border-dashed animate-spin" style="border-color: ${statusColor}cc; animation-duration: 6s;"></div>
          <!-- Glowing Center Eye -->
          <div class="relative w-4 h-4 rounded-full flex items-center justify-center shadow-lg" style="background: ${statusColor}; box-shadow: 0 0 16px ${statusColor};">
            <div class="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
          </div>
          <!-- Floating Label Badge -->
          <div class="absolute -top-7 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold text-white shadow-xl whitespace-nowrap border flex items-center gap-1.5 pointer-events-none" style="background: rgba(6, 11, 25, 0.9); border-color: ${statusColor}99;">
            <span>${c.name}</span>
            <span class="text-cyan-300 font-extrabold">${c.maxWindKmH} km/h</span>
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedCycloneId(c.id);
        if (onSelectCyclone) onSelectCyclone(c.id);

        // Open Rich Meteorological Map Popup
        if (popupRef.current) popupRef.current.remove();

        const popupContent = `
          <div class="p-3.5 space-y-2.5 font-mono text-slate-200" style="background: #091126; min-width: 220px; border-radius: 12px;">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div class="text-xs font-black text-cyan-400 uppercase">${c.name}</div>
                <div class="text-[10px] text-slate-400">${c.region}</div>
              </div>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold" style="background: #00b4d822; color: #00b4d8; border: 1px solid #00b4d855;">
                ${c.classification}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span class="text-[9px] text-slate-500 block uppercase">Max Wind</span>
                <strong class="text-white">${c.maxWindKmH} km/h</strong> <span class="text-slate-400">(${c.maxWindKt} kt)</span>
              </div>
              <div>
                <span class="text-[9px] text-slate-500 block uppercase">Pressure</span>
                <strong class="text-teal-300">${c.centralPressureHpa} hPa</strong>
              </div>
              <div>
                <span class="text-[9px] text-slate-500 block uppercase">Movement</span>
                <span class="text-slate-300">${c.movementDirection} @ ${c.movementSpeedKmH} km/h</span>
              </div>
              <div>
                <span class="text-[9px] text-slate-500 block uppercase">Position</span>
                <span class="text-slate-300">${c.latitude}°N, ${c.longitude}°E</span>
              </div>
            </div>

            <div class="text-[9px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between items-center">
              <span>Obs: ${c.lastObservation}</span>
              <span class="text-amber-400 font-bold">DEMO DATA</span>
            </div>

            <div class="pt-2 flex gap-2">
              <a href="/user/cyclones/${c.id}" class="flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold text-cyan-950 font-mono transition-all hover:bg-cyan-300 shadow-md" style="background: #00b4d8;">
                VIEW DETAILS
              </a>
              <a href="/user/forecast" class="flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold text-cyan-300 font-mono transition-all hover:bg-cyan-500/30 border border-cyan-500/40" style="background: #00b4d818;">
                FORECAST
              </a>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: 24,
          closeButton: true,
          closeOnClick: true,
          className: 'custom-maplibre-popup',
        })
          .setLngLat([c.longitude, c.latitude])
          .setHTML(popupContent)
          .addTo(map);

        popupRef.current = popup;
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([c.longitude, c.latitude])
        .addTo(map);

      markersRef.current[c.id] = marker;
    });
  }, [cyclones, selectedCycloneId, setSelectedCycloneId, onSelectCyclone, mapLoaded]);

  return (
    <div className={`relative ${className} bg-[#040814] overflow-hidden select-none`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
