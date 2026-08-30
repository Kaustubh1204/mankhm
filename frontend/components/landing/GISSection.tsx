'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Compass, Navigation, AlertTriangle } from 'lucide-react';

export default function GISSection() {
  return (
    <section className="relative py-28 bg-[#060b19] z-10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <Globe className="h-3.5 w-3.5" />
            <span>3D SPATIAL MAP ENGINE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Geographic Risk & Track Corridor
          </h2>
          <p className="text-lg text-slate-300">
            Interactive multi-layered 3D spatial mapping across ocean basins and coastal landfalls.
          </p>
        </div>

        {/* 3D Map Container */}
        <motion.div
          data-card
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-[#091126] border border-cyan-500/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,180,216,0.2)] overflow-hidden"
        >
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-base font-bold text-white tracking-wide">
                North Indian Ocean Basin
              </h3>
            </div>

            {/* MANDATORY CONCEPTUAL VISUALIZATION BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>CONCEPTUAL VISUALIZATION</span>
            </div>
          </div>

          {/* 3D Tilted Map Visual Canvas */}
          <div className="relative w-full aspect-[16/9] max-h-[460px] rounded-2xl bg-[#050917] border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            
            {/* Tilted 3D Grid Plane background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00b4d815_1px,transparent_1px),linear-gradient(to_bottom,#00b4d815_1px,transparent_1px)] bg-[size:3rem_3rem] [transform:rotateX(55deg)_rotateZ(-15deg)_scale(1.4)] origin-center opacity-70 pointer-events-none" />

            {/* Ocean Basin Regions Labels */}
            <div className="absolute top-12 left-12 flex flex-col gap-1 pointer-events-none">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest bg-[#070e24]/80 px-2.5 py-1 rounded border border-cyan-900/50">
                ARABIAN SEA
              </span>
            </div>

            <div className="absolute top-12 right-12 flex flex-col gap-1 pointer-events-none">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest bg-[#070e24]/80 px-2.5 py-1 rounded border border-cyan-900/50">
                BAY OF BENGAL
              </span>
            </div>

            <div className="absolute bottom-10 center flex flex-col items-center gap-1 pointer-events-none">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest bg-[#070e24]/80 px-3 py-1 rounded border border-blue-900/50">
                INDIAN OCEAN BASIN
              </span>
            </div>

            {/* Geographic Landmass Outline SVG Representation (India & Coastal Lines) */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 800 450" className="w-full h-full text-slate-700 opacity-60">
                {/* Conceptual Peninsular India Outline */}
                <path
                  d="M 320 80 L 480 80 L 460 220 L 400 340 L 350 220 Z"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                
                {/* Conceptual Cyclone Track Vector Path */}
                <path
                  d="M 540 330 Q 480 260 410 170 T 360 110"
                  fill="none"
                  stroke="#00b4d8"
                  strokeWidth="3.5"
                  className="animate-pulse"
                />

                {/* Conceptual Forecast Cone Corridor */}
                <path
                  d="M 540 330 L 440 140 L 320 90 L 400 200 Z"
                  fill="rgba(0, 180, 216, 0.08)"
                  stroke="rgba(0, 180, 216, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
              </svg>

              {/* Waypoint Nodes along Conceptual Track */}
              <div className="absolute top-[35%] left-[50%] flex items-center gap-2 bg-[#09132c] border border-cyan-500/50 px-3 py-1.5 rounded-lg shadow-lg">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-200 font-semibold">Forecast Cone Corridor</span>
              </div>

              <div className="absolute bottom-[28%] right-[32%] flex items-center gap-2 bg-[#09132c] border border-blue-500/50 px-3 py-1.5 rounded-lg shadow-lg">
                <Navigation className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-mono text-blue-200 font-semibold">Track Vector</span>
              </div>
            </div>

            {/* Compass Rose */}
            <div className="absolute bottom-6 left-6 p-3 rounded-full bg-[#081026]/90 border border-slate-700 text-cyan-400 shadow-md">
              <Compass className="h-6 w-6" />
            </div>
          </div>

          {/* Map Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#060c1e] border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>3D Track Projection</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#060c1e] border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Probabilistic Impact Cone</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#060c1e] border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Multi-Layer GIS Layers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
