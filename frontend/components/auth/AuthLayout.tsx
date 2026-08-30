'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Globe, Cpu, Activity } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#060b19] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(0,180,216,0.12),transparent_100%)] pointer-events-none" />

      {/* Main Grid Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex-1 flex items-center py-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: BRANDING & ATMOSPHERIC VISUAL (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-6">
            <div className="space-y-6">
              {/* Brand Header */}
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(0,180,216,0.4)]">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    CYCLONESENSE <span className="text-cyan-400 font-mono text-base">AI</span>
                  </span>
                  <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                    DETECT. CLASSIFY. PREDICT.
                  </span>
                </div>
              </Link>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-POWERED TROPICAL INTELLIGENCE</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Next-Generation Atmospheric Hazard Intelligence.
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-lg">
                Multi-source satellite observation, automated neural vortex classification, and trajectory modeling built for meteorological precision.
              </p>
            </div>

            {/* Visual Intelligence Badges */}
            <div className="space-y-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Multi-Source Satellite GIS Grid Pipelines</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Cpu className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Automated Dvorak & Eye Symmetry Scoring</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Activity className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Realtime Telemetry & Ensemble Track Corridors</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AUTHENTICATION FORM CARD */}
          <div className="lg:col-span-6 max-w-md w-full mx-auto">
            {/* Mobile Header Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  CYCLONESENSE <span className="text-cyan-400 font-mono text-sm">AI</span>
                </span>
              </Link>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-[#0a1126]/90 border border-slate-800 shadow-[0_0_50px_rgba(0,180,216,0.15)] backdrop-blur-xl space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
                <p className="text-sm text-slate-300 mt-1">{subtitle}</p>
              </div>

              {children}
            </div>
          </div>

        </div>
      </div>

      {/* Footer copyright line */}
      <div className="container mx-auto px-4 py-4 text-center text-xs font-mono text-slate-500 border-t border-slate-800/60 z-10">
        © {new Date().getFullYear()} CycloneSense AI Platform. All rights reserved.
      </div>
    </div>
  );
}
