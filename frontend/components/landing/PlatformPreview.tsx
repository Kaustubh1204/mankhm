'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, ArrowRight } from 'lucide-react';

export default function PlatformPreview() {
  const userFeatures = [
    'Live Active Cyclone Tracking',
    '72h–120h Track & Intensity Forecast',
    'Interactive GIS Risk Hazard Maps',
    'Realtime Automated Emergency Alerts',
    'Historical Cyclone Archive & Analytics',
  ];

  const opsFeatures = [
    'End-to-End Pipeline Telemetry',
    'Realtime Kafka Message Stream Health',
    'Automated ML Model Drift & Inference',
    'Satellite Sensor Ingestion Monitor',
    'System Node Health & Latency Metrics',
  ];

  return (
    <section id="platform" className="relative py-28 bg-[#050915] z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <span>OPERATIONAL VIEWS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            One intelligence platform.{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Two operational views.
            </span>
          </h2>
          <p className="text-lg text-slate-300">
            Tailored interfaces for decision-makers and platform operations engineers.
          </p>
        </div>

        {/* 2 Big 3D Hover Tilt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Card 1: USER INTELLIGENCE */}
          <motion.div
            data-card
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0a132b] to-[#070d1e] border border-cyan-500/40 shadow-[0_0_35px_rgba(0,180,216,0.15)] flex flex-col justify-between group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-inner">
                  <Users className="h-7 w-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                  PUBLIC & DECISION MAKERS
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-white tracking-wide mb-3">
                USER INTELLIGENCE
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                Clean, high-level tactical interface designed for meteorologists, emergency response units, and coastal authorities.
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                {userFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10">
              <a
                href="/signin"
                className="btn interactive-button inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md"
              >
                <span>ACCESS USER PORTAL</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: OPERATIONAL CONTROL */}
          <motion.div
            data-card
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0a132b] to-[#070d1e] border border-blue-500/40 shadow-[0_0_35px_rgba(59,130,246,0.15)] flex flex-col justify-between group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-300 shadow-inner">
                  <Activity className="h-7 w-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono font-bold border border-blue-500/30">
                  SYSTEM ENGINEERS
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-white tracking-wide mb-3">
                OPERATIONAL CONTROL
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                Detailed telemetry dashboard for monitoring model pipelines, Kafka stream health, latency, and system nodes.
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                {opsFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10">
              <a
                href="/signin"
                className="btn interactive-button inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#142247] hover:bg-[#1a2d5c] border border-blue-500/50 text-white font-bold text-sm transition-all shadow-md"
              >
                <span>OPEN OPERATIONAL CONSOLE</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
