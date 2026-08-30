'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Network, Sparkles, Binary, ShieldCheck } from 'lucide-react';

export default function AIIntelligence() {
  const capabilities = [
    {
      icon: Network,
      title: 'Neural Matrix Topology',
      desc: '3D spatial convolution networks map multi-channel cloud brightness temperatures directly to storm category structures.',
    },
    {
      icon: Sparkles,
      title: 'Spatio-Temporal Feature Fusion',
      desc: 'Combines historical storm tracks with temporal satellite image series to model non-linear steering flow interactions.',
    },
    {
      icon: Binary,
      title: 'Automated Dvorak Enhancement',
      desc: 'Augments traditional manual meteorological analysis with continuous, objective eyewall symmetry scoring.',
    },
    {
      icon: ShieldCheck,
      title: 'Ensemble Risk Projection',
      desc: 'Generates probabilistic cone projections with uncertainty bounds for emergency management teams.',
    },
  ];

  return (
    <section className="relative py-28 bg-[#050914] z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <span>AI NEURAL ENGINE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Deep Learning Atmosphere Modeling
          </h2>
          <p className="text-lg text-slate-300">
            From raw satellite pixels to spatial trajectory predictions through custom meteorological deep neural networks.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                data-card
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="p-8 rounded-2xl bg-[#091126]/90 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 transition-all duration-300 shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
