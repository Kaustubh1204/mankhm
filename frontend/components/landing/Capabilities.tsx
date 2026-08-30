'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Cpu, Navigation, ShieldAlert, Layers, Activity } from 'lucide-react';

export default function Capabilities() {
  const cards = [
    {
      icon: Radio,
      title: 'LIVE CYCLONE MONITORING',
      description:
        'Continuous orbital and geostationary satellite monitoring for immediate detection of atmospheric vortex formation.',
      color: 'text-cyan-400',
    },
    {
      icon: Cpu,
      title: 'AI INTENSITY ANALYSIS',
      description:
        'Automated deep neural network evaluation of cloud top temperatures, eyewall structure, and convective strength.',
      color: 'text-blue-400',
    },
    {
      icon: Navigation,
      title: 'TRACK FORECASTING',
      description:
        'Probabilistic trajectory corridors and steering flow ensemble modeling up to 120 hours in advance.',
      color: 'text-teal-400',
    },
    {
      icon: ShieldAlert,
      title: 'RISK VISUALIZATION',
      description:
        'Multi-layer GIS coastal hazard maps outlining surge potential, wind speed thresholds, and rainfall intensity.',
      color: 'text-indigo-400',
    },
    {
      icon: Layers,
      title: 'MULTI-SOURCE DATA',
      description:
        'Seamless integration of optical satellite, microwave sounding, ocean scatterometry, and synoptic weather data.',
      color: 'text-cyan-300',
    },
    {
      icon: Activity,
      title: 'OPERATIONAL MONITORING',
      description:
        'Real-time telemetry, model inference latency, and system health metrics for enterprise operational resilience.',
      color: 'text-blue-300',
    },
  ];

  return (
    <section id="capabilities" className="relative py-28 bg-[#060b19] z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed for Meteorological Precision
          </h2>
          <p className="text-lg text-slate-300">
            End-to-end intelligence suite built for accuracy, speed, and real-time operational response.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                data-card
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-[#091126]/80 border border-slate-800 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 shadow-lg group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-inner">
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <h3 className="text-sm font-mono font-bold tracking-wider text-cyan-300 uppercase mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
