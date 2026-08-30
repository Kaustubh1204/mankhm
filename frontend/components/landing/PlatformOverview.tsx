'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldAlert, Activity, Bell, Database, Server } from 'lucide-react';

export default function PlatformOverview() {
  return (
    <section id="platform" className="py-28 bg-transparent relative border-t border-slate-800/40 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase mb-3">
            PLATFORM TIERS
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Designed for Operators & Administrators
          </p>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            Tailored interfaces for meteorological operational staff, disaster emergency teams, and system infrastructure engineers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* USER PANEL CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-[#141e36]/80 border border-slate-800/80 backdrop-blur-md p-8 flex flex-col justify-between hover:border-cyan-500/40 hover:bg-[#141e36] transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">User Intelligence Panel</h3>
                    <span className="text-xs font-mono text-cyan-400">OPERATIONAL WEATHER DASHBOARD</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Enables analysts and emergency responder teams to monitor active storms, set geofenced warning alerts, and inspect AI forecast trajectories.
              </p>

              <div className="space-y-3 font-sans text-sm text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b132b]/80 border border-slate-800">
                  <Bell className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Realtime WebHook & Push Warning Notifications</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b132b]/80 border border-slate-800">
                  <Activity className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Interactive Trajectory Cone & Wind Radii Inspector</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b132b]/80 border border-slate-800">
                  <ShieldAlert className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Automated Landfall Risk Analysis Reports</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400">Role: Forecasters & Disaster Response Units</span>
            </div>
          </motion.div>

          {/* ADMIN PANEL CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-[#141e36]/80 border border-slate-800/80 backdrop-blur-md p-8 flex flex-col justify-between hover:border-blue-500/40 hover:bg-[#141e36] transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Admin System Command</h3>
                    <span className="text-xs font-mono text-blue-400">INFRASTRUCTURE & ML TELEMETRY</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Provides infrastructure engineering teams full control over satellite ingestion streams, Kafka message queues, collector nodes, and model inference metrics.
              </p>

              <div className="space-y-3 font-sans text-sm text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b132b]/80 border border-slate-800">
                  <Database className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Kafka Pipeline Telemetry & Collector Ingestion Metrics</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b132b]/80 border border-slate-800">
                  <Server className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Neural Inference Latency & GPU Resource Monitor</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b132b]/80 border border-slate-800">
                  <Activity className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Data Reduction & Dimensionality Filtering Controls</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400">Role: System Engineers & ML Ops Administrators</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
