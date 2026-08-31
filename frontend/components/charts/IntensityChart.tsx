'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CycloneForecast, CycloneTrackPoint } from '@/types/cyclone';

interface IntensityChartProps {
  forecast?: CycloneForecast | null;
  observedPoints?: CycloneTrackPoint[];
  height?: number;
}

export default function IntensityChart({
  forecast,
  observedPoints = [],
  height = 260,
}: IntensityChartProps) {
  // Combine observed points and forecast points into continuous chart series
  const data = React.useMemo(() => {
    const points: {
      time: string;
      observedWind?: number;
      forecastWind?: number;
      upperConfidence?: number;
      lowerConfidence?: number;
      classification: string;
      pressure: number;
    }[] = [];

    if (observedPoints && observedPoints.length > 0) {
      observedPoints.forEach((p) => {
        points.push({
          time: p.timeHorizon,
          observedWind: p.windSpeedKmH,
          classification: p.classification,
          pressure: p.centralPressureHpa,
        });
      });
    }

    if (forecast && forecast.points && forecast.points.length > 0) {
      forecast.points.forEach((p) => {
        const spread = (p.confidenceRadiusKm || 20) * 0.25;
        // Merge with NOW if already added
        if (p.timeHorizon === 'NOW') {
          const nowIdx = points.findIndex((x) => x.time === 'NOW');
          if (nowIdx >= 0) {
            points[nowIdx].forecastWind = p.windSpeedKmH;
            points[nowIdx].upperConfidence = p.windSpeedKmH + spread;
            points[nowIdx].lowerConfidence = Math.max(0, p.windSpeedKmH - spread);
          } else {
            points.push({
              time: p.timeHorizon,
              observedWind: p.windSpeedKmH,
              forecastWind: p.windSpeedKmH,
              upperConfidence: p.windSpeedKmH + spread,
              lowerConfidence: Math.max(0, p.windSpeedKmH - spread),
              classification: p.classification,
              pressure: p.centralPressureHpa,
            });
          }
        } else {
          points.push({
            time: p.timeHorizon,
            forecastWind: p.windSpeedKmH,
            upperConfidence: p.windSpeedKmH + spread,
            lowerConfidence: Math.max(0, p.windSpeedKmH - spread),
            classification: p.classification,
            pressure: p.centralPressureHpa,
          });
        }
      });
    }

    return points;
  }, [forecast, observedPoints]);

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-bold uppercase">Wind Speed Trajectory (km/h)</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Observed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Predicted</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-500/20 border border-cyan-500/40 rounded-sm" /> 87% Confidence</span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#334155' }}
              domain={[40, 220]}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-xl bg-[#091126] border border-cyan-500/40 shadow-xl font-mono text-[11px] space-y-1">
                      <div className="font-bold text-cyan-300">{label} Horizon</div>
                      <div className="text-white font-bold">
                        Wind: {p.forecastWind || p.observedWind} km/h
                      </div>
                      <div className="text-teal-300 text-[10px]">Pressure: {p.pressure} hPa</div>
                      <div className="text-slate-400 text-[10px]">{p.classification}</div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine y={118} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Very Severe (118)', fill: '#f59e0b', fontSize: 9 }} />
            <ReferenceLine y={166} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Extremely Severe (166)', fill: '#ef4444', fontSize: 9 }} />

            {/* Confidence Band */}
            <Area
              type="monotone"
              dataKey="upperConfidence"
              stroke="transparent"
              fill="url(#confidenceGradient)"
            />
            <Area
              type="monotone"
              dataKey="lowerConfidence"
              stroke="transparent"
              fill="#060b19"
            />

            {/* Observed Wind Speed Line */}
            <Area
              type="monotone"
              dataKey="observedWind"
              stroke="#00b4d8"
              strokeWidth={3}
              fill="url(#forecastGradient)"
              dot={{ r: 4, fill: '#00b4d8', stroke: '#060b19', strokeWidth: 2 }}
            />

            {/* Forecast Wind Speed Line */}
            <Area
              type="monotone"
              dataKey="forecastWind"
              stroke="#38bdf8"
              strokeWidth={2.5}
              strokeDasharray="4 3"
              fill="transparent"
              dot={{ r: 4, fill: '#38bdf8', stroke: '#060b19', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
