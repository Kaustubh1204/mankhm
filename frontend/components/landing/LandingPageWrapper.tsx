'use client';

import React, { useState } from 'react';
import { useScrollProgress } from '@/lib/useScrollProgress';
import HeroTransition from './HeroTransition';
import CycloneCursor from './CycloneCursor';
import AtmosphericScene from './AtmosphericScene';
import Navbar from './Navbar';
import Hero from './Hero';
import WhyCycloneSense from './WhyCycloneSense';
import PipelineSection from './PipelineSection';
import MultiSourceIntel from './MultiSourceIntel';
import AIIntelligence from './AIIntelligence';
import GISSection from './GISSection';
import PlatformPreview from './PlatformPreview';
import Capabilities from './Capabilities';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

export default function LandingPageWrapper() {
  const { scrollProgress: fallbackScrollProgress, prefersReducedMotion } = useScrollProgress();
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeProgress = scrollProgress > 0 ? scrollProgress : fallbackScrollProgress;

  return (
    <div className="relative min-h-screen bg-[#060b19] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* SIGNATURE 3D CYCLONE CUSTOM CURSOR */}
      <CycloneCursor />

      {/* GSAP SCROLLTRIGGER PROGRESS CONTROLLER */}
      <HeroTransition onScrollProgressUpdate={setScrollProgress} />

      {/* ABSTRACT 3D ATMOSPHERIC ENVIRONMENT BACKGROUND (NO GIANT CYCLONE) */}
      <AtmosphericScene
        scrollProgress={activeProgress}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* FOREGROUND SECTIONS */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero scrollProgress={activeProgress} />
          <WhyCycloneSense />
          <PipelineSection />
          <MultiSourceIntel />
          <AIIntelligence />
          <GISSection />
          <PlatformPreview />
          <Capabilities />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
