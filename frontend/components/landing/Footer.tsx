'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050814] border-t border-slate-800/80 py-12 text-slate-400 text-sm z-10 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-slate-950">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                CYCLONESENSE <span className="text-cyan-400 font-mono text-xs">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              AI-powered tropical cyclone intelligence platform for cyclone detection, classification, forecasting and risk intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Overview</a></li>
              <li><a href="#technology" className="hover:text-cyan-400 transition-colors">Technology</a></li>
              <li><a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Platform Tiers */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Views
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#platform" className="hover:text-cyan-400 transition-colors">User Intelligence</a></li>
              <li><a href="#platform" className="hover:text-cyan-400 transition-colors">Operational Control</a></li>
              <li><a href="/signin" className="hover:text-cyan-400 transition-colors">Sign In Portal</a></li>
              <li><a href="/signup" className="hover:text-cyan-400 transition-colors">Get Started</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <div>© {new Date().getFullYear()} CycloneSense AI. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 text-cyan-400 font-semibold tracking-wider">DETECT. CLASSIFY. PREDICT.</div>
        </div>
      </div>
    </footer>
  );
}
