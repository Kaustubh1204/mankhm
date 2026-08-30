'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Cpu, Activity } from 'lucide-react';

interface HeroProps {
  scrollProgress?: number;
}

export default function Hero({ scrollProgress = 0 }: HeroProps) {
  // Smooth opacity fade on scroll (0 -> 0.18)
  const textOpacity = Math.max(0, 1 - scrollProgress * 5.5);
  const textTranslateY = -scrollProgress * 150;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-20 z-10 select-none">
      {/* Soft atmospheric gradient glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060b19]/40 to-[#060b19] pointer-events-none z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-20 text-center">
        <motion.div
          style={{ opacity: textOpacity, y: textTranslateY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center max-w-4xl mx-auto space-y-8"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase shadow-[0_0_20px_rgba(0,180,216,0.15)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI-POWERED CYCLONE INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg max-w-4xl">
            See the{' '}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent underline decoration-cyan-500/40 decoration-wavy decoration-2">
              Storm
            </span>{' '}
            Before It Escalates.
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-normal leading-relaxed max-w-3xl drop-shadow">
            Detect, classify and forecast tropical cyclone activity using multi-source satellite intelligence and AI.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <a
              href="#platform"
              className="btn interactive-button inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base transition-all duration-200 shadow-[0_0_30px_rgba(0,180,216,0.35)] hover:shadow-[0_0_45px_rgba(0,180,216,0.6)] transform hover:-translate-y-1 active:translate-y-0"
            >
              <span>EXPLORE PLATFORM</span>
              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href="#how-it-works"
              className="btn interactive-button inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#0e172e]/90 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-[#14203e] text-slate-100 font-semibold text-base transition-all duration-200 backdrop-blur-md shadow-lg transform hover:-translate-y-1"
            >
              <Play className="h-4 w-4 text-cyan-400 fill-cyan-400/20" />
              <span>HOW IT WORKS</span>
            </a>
          </div>

          {/* Intelligence Capabilities Summary */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl border-t border-slate-800/80 text-left">
            <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#0c1429]/60 border border-slate-800/60 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">Multi-Source GIS</h4>
                <p className="text-xs text-slate-400 mt-1">Satellite, microwave & wind scatterometry</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#0c1429]/60 border border-slate-800/60 backdrop-blur-sm">
              <Cpu className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono text-blue-300 font-semibold uppercase tracking-wider">Deep Learning</h4>
                <p className="text-xs text-slate-400 mt-1">Automated classification & intensity estimation</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#0c1429]/60 border border-slate-800/60 backdrop-blur-sm">
              <Activity className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono text-teal-300 font-semibold uppercase tracking-wider">Realtime Alerting</h4>
                <p className="text-xs text-slate-400 mt-1">Instant risk assessment & trajectory forecasting</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
