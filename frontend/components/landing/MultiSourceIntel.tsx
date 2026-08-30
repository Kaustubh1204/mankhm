'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Eye, Wind, Thermometer, Cpu } from 'lucide-react';

export default function MultiSourceIntel() {
  const sources = [
    {
      icon: Eye,
      title: 'Geostationary Satellite Feeds',
      description: 'Continuous infrared and visible spectrum cloud geometry streaming in real time.',
      tag: 'OPTICAL / INFRARED',
    },
    {
      icon: Radio,
      title: 'Microwave Radiometry',
      description: 'Deep cloud-penetrating microwave observation for eyewall structure and rainband density.',
      tag: 'MICROWAVE SOUNDING',
    },
    {
      icon: Wind,
      title: 'Ocean Wind Scatterometry',
      description: 'Satellite radar scatterometer measurements of ocean surface roughness and wind vector fields.',
      tag: 'SCATTEROMETRY',
    },
    {
      icon: Thermometer,
      title: 'Meteorological Observations',
      description: 'Synoptic weather charts, atmospheric sounding profiles, and sea surface temperature maps.',
      tag: 'SYNOPTIC METEOROLOGY',
    },
  ];

  return (
    <section className="relative py-28 bg-[#060b19] z-10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
            <span>MULTI-SOURCE CONVERGENCE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Multi-Source Satellite Intelligence
          </h2>
          <p className="text-lg text-slate-300">
            Harmonizing disparate Earth observation streams into a single high-fidelity AI feature matrix.
          </p>
        </div>

        {/* Central AI Node Diagram / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Sources Column (2 sources) */}
          <div className="lg:col-span-4 space-y-6">
            {sources.slice(0, 2).map((src, i) => {
              const Icon = src.icon;
              return (
                <motion.div
                  key={src.title}
                  data-card
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="p-6 rounded-2xl bg-[#0b132a]/90 border border-slate-800 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {src.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{src.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{src.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Center Central AI Engine Node */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center my-6 lg:my-0">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-10 rounded-full bg-gradient-to-b from-cyan-500/20 via-[#0e1b38] to-[#060b19] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,180,216,0.3)] flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-[#070e24] border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,180,216,0.5)] mb-4 animate-pulse">
                <Cpu className="h-10 w-10 text-cyan-300" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                CENTRAL AI NODE
              </span>
              <span className="text-sm font-semibold text-white mt-1">
                Multi-Modal Fusion
              </span>
            </motion.div>
          </div>

          {/* Right Sources Column (2 sources) */}
          <div className="lg:col-span-4 space-y-6">
            {sources.slice(2, 4).map((src, i) => {
              const Icon = src.icon;
              return (
                <motion.div
                  key={src.title}
                  data-card
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="p-6 rounded-2xl bg-[#0b132a]/90 border border-slate-800 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-blue-400 uppercase bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                      {src.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{src.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{src.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
