'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Radio, Compass, Shield } from 'lucide-react';

export default function GISPreview() {
  return (
    <section id="gis-visualization" className="py-28 bg-transparent relative border-t border-slate-800/40 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase mb-3">
            GIS COMMAND CENTER
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Integrated Spatial & Radar Interface
          </p>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            Multi-layer GIS mapping interface designed for weather forecasters, disaster agencies, and climate analysts.
          </p>
        </motion.div>

        {/* Abstract GIS Interface Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-[#141e36]/80 border border-slate-800/80 backdrop-blur-md p-6 md:p-8 shadow-[0_0_50px_rgba(0,180,216,0.1)] overflow-hidden"
        >
          {/* Top Bar HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-bold">GIS RADAR GRID STREAM</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">MULTISPECTRAL INFRARED</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>PROJECTION: MERCATOR / SPHERICAL</span>
              <span>GRID RES: 0.1° SPATIAL</span>
            </div>
          </div>

          {/* Grid Area with Radar Rings Graphic */}
          <div className="relative my-8 h-80 sm:h-96 w-full rounded-2xl bg-[#0b132b]/90 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e294225_1px,transparent_1px),linear-gradient(to_bottom,#1e294225_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-cyan-500/20 flex items-center justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-cyan-500/30 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan-400/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-300/60 bg-cyan-500/10 flex items-center justify-center animate-pulse">
                    <Compass className="h-6 w-6 text-cyan-400 animate-spin-slow" />
                  </div>
                </div>
              </div>

              <div className="absolute w-full h-[1px] bg-cyan-500/20" />
              <div className="absolute h-full w-[1px] bg-cyan-500/20" />
            </div>

            <div className="absolute top-4 left-4 font-mono text-[10px] space-y-1 bg-[#141e36]/90 p-3 rounded-lg border border-slate-700/60 text-slate-300">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <Layers className="h-3.5 w-3.5" />
                <span>SPATIAL LAYERS ACTIVE</span>
              </div>
              <div className="text-slate-400">✓ Thermal IR Brightness</div>
              <div className="text-slate-400">✓ Microwave Eye Structure</div>
              <div className="text-slate-400">✓ Scatterometer Wind Vectors</div>
            </div>

            <div className="absolute bottom-4 right-4 font-mono text-[10px] bg-[#141e36]/90 p-3 rounded-lg border border-slate-700/60 text-slate-300">
              <div className="text-cyan-300 font-semibold mb-0.5">SPATIAL TENSOR STATUS</div>
              <div className="text-slate-400">Continuous Ingestion Pipeline</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Multi-Layer GIS Overlay Control</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-400" />
              <span>Live Doppler & Satellite Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-400" />
              <span>Landfall Projection Coordinates</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
