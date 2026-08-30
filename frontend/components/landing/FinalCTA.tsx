'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-32 bg-[#050814] z-10 overflow-hidden text-center">
      {/* Background radial atmosphere glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,180,216,0.15),transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-[#0a132b]/90 to-[#060b19] border border-cyan-500/40 shadow-[0_0_60px_rgba(0,180,216,0.25)] backdrop-blur-xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DEPLOY NEXT-GEN INTELLIGENCE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Turn satellite data into{' '}
            <span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              actionable cyclone intelligence.
            </span>
          </h2>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Empower your team with real-time vortex detection, automated category classification, and high-precision trajectory forecasting.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <a
              href="/signup"
              className="btn interactive-button inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(0,180,216,0.4)] transform hover:-translate-y-1"
            >
              <span>GET STARTED</span>
              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href="#technology"
              className="btn interactive-button inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#0e172e] border border-slate-700 hover:border-cyan-500/50 text-slate-100 font-semibold text-base transition-all shadow-lg transform hover:-translate-y-1"
            >
              <span>EXPLORE TECHNOLOGY</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
