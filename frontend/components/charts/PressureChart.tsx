'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CycloneForecast, CycloneTrackPoint } from '@/types/cyclone';

interface PressureChartProps {
  forecast?: CycloneForecast | null;
  observedPoints?: CycloneTrackPoint[];
  height?: number;
}

export default function PressureChart({
  forecast,
  observedPoints = [],
  height = 240,
}: PressureChartProps) {
  const data = React.useMemo(() => {
    const points: { time: string; pressure: number; isForecast?: boolean }[] = [];

    if (observedPoints && observedPoints.length > 0) {
      observedPoints.forEach((p) => {
        points.push({
          time: p.timeHorizon,
          pressure: p.centralPressureHpa,
          isForecast: false,
        });
      });
    }

    if (forecast && forecast.points && forecast.points.length > 0) {
      forecast.points.forEach((p) => {
        if (p.timeHorizon !== 'NOW' || !points.some((x) => x.time === 'NOW')) {
          points.push({
            time: p.timeHorizon,
            pressure: p.centralPressureHpa,
            isForecast: true,
          });
        }
      });
    }

    return points;
  }, [forecast, observedPoints]);

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-bold uppercase">Central Pressure Evolution (hPa)</span>
        <span className="text-[10px] text-teal-400 font-bold">Inverted Scale (Deeper = Stronger)</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#334155' }}
            />
            {/* Inverted domain so lower pressure (stronger vortex) appears at the top */}
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#334155' }}
              domain={[930, 1010]}
              reversed
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-xl bg-[#091126] border border-teal-500/40 shadow-xl font-mono text-[11px] space-y-1">
                      <div className="font-bold text-teal-300">{label} Horizon</div>
                      <div className="text-white font-bold">Central Pressure: {p.pressure} hPa</div>
                      <div className="text-slate-400 text-[10px]">{p.isForecast ? 'Model Prediction' : 'Observed Sounding'}</div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceLine y={960} stroke="#14b8a6" strokeDasharray="2 2" label={{ value: 'Intense Vortex (960 hPa)', fill: '#14b8a6', fontSize: 9 }} />

            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#14b8a6', stroke: '#060b19', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#2dd4bf' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
