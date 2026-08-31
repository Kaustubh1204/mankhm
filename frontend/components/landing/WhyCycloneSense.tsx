'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Database, Cpu, ArrowRight } from 'lucide-react';

export default function WhyCycloneSense() {
  const steps = [
    {
      icon: CloudRain,
      stage: '01',
      title: 'ATMOSPHERE',
      subtitle: 'Raw Weather Dynamics',
      description:
        'Continuous atmospheric moisture, pressure field variations, and wind shear vector dynamics captured across global meteorological monitoring systems.',
      color: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Database,
      stage: '02',
      title: 'DATA',
      subtitle: 'Structured GIS Streams',
      description:
        'Multi-spectral satellite imagery, microwave radiometry, and surface observations transformed into high-resolution spatial grid pipelines.',
      color: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      icon: Cpu,
      stage: '03',
      title: 'INTELLIGENCE',
      subtitle: 'AI Risk Forecasting',
      description:
        'Deep neural networks synthesize spatio-temporal dynamics to detect formation, classify storm category, and predict trajectory corridors.',
      color: 'from-teal-500/20 to-cyan-500/10',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 bg-[#060b19]/90 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <span>THE INTELLIGENCE PIPELINE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Every minute matters.
          </h2>
          <p className="text-lg text-slate-300">
            Transforming chaotic atmospheric chaos into actionable spatial intelligence through automated AI processing.
          </p>
        </div>

        {/* 3-Step Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                data-card
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`relative p-8 rounded-2xl bg-gradient-to-b ${step.color} border ${step.borderColor} backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,180,216,0.2)] group`}
              >
                {/* Step Stage Number */}
                <div className="absolute top-6 right-6 font-mono text-3xl font-black text-slate-700/50 group-hover:text-cyan-400/40 transition-colors">
                  {step.stage}
                </div>

                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-[#091024] border border-slate-700 flex items-center justify-center mb-6 shadow-inner">
                  <Icon className={`h-7 w-7 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                  {step.title}
                </h3>
                <h4 className="text-xl font-bold text-white mt-1 mb-3">
                  {step.subtitle}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting arrow indicator between cards on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#081026] border border-slate-700 items-center justify-center text-cyan-400">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
