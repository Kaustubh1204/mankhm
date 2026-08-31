'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Layers, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function PipelineSection() {
  const paths = [
    {
      id: 'detect',
      icon: Target,
      badge: 'DETECTION ENGINE',
      title: 'DETECT',
      headline: 'Early Vortex Identification',
      description:
        'Continuous deep scanning across satellite feeds detects atmospheric depression anomalies prior to tropical cyclone spin-up.',
      features: [
        'Multi-spectral vortex isolation',
        'Sea surface thermal gradient analysis',
        'Sub-geostationary temporal tracking',
      ],
      glow: 'shadow-[0_0_30px_rgba(0,180,216,0.15)]',
      border: 'border-cyan-500/40',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 'classify',
      icon: Layers,
      badge: 'CLASSIFICATION ENGINE',
      title: 'CLASSIFY',
      headline: 'Automated Category & Intensity',
      description:
        'Neural convolution models estimate central pressure, maximum sustained wind boundaries, and eyewall symmetry structure.',
      features: [
        'Dvorak technique automation',
        'Convective structure profiling',
        'Intensity progression classification',
      ],
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      border: 'border-blue-500/40',
      tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    {
      id: 'predict',
      icon: TrendingUp,
      badge: 'PREDICTION ENGINE',
      title: 'PREDICT',
      headline: 'Trajectory & Landfall Corridor',
      description:
        'Ensemble deep learning models project probabilistic track corridors and coastal impact hazard zones up to 120 hours in advance.',
      features: [
        'Probabilistic track cone generation',
        'Steering flow interaction modeling',
        'Coastal impact risk estimation',
      ],
      glow: 'shadow-[0_0_30px_rgba(20,184,166,0.15)]',
      border: 'border-teal-500/40',
      tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    },
  ];

  return (
    <section id="technology" className="relative py-28 bg-[#050915] z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <span>THREE VISUAL PATHS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Detect. Classify. Predict.
          </h2>
          <p className="text-lg text-slate-300">
            A unified neural pipeline processing global satellite streams into structured atmospheric hazard forecasts.
          </p>
        </div>

        {/* 3 Paths Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {paths.map((path, idx) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.id}
                data-card
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className={`p-8 rounded-2xl bg-[#0a1226]/80 border ${path.border} ${path.glow} backdrop-blur-md relative flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${path.tagColor}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{path.badge}</span>
                    </span>
                    <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <h3 className="text-2xl font-black text-white tracking-wide mb-2">
                    {path.headline}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {path.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className="pt-6 border-t border-slate-800 space-y-3">
                  {path.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
