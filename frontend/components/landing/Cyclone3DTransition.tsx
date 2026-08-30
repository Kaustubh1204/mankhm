'use client';

import React from 'react';
import CycloneScene from './CycloneScene';

interface Cyclone3DTransitionProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
}

export default function Cyclone3DTransition({
  scrollProgress,
  prefersReducedMotion = false,
}: Cyclone3DTransitionProps) {
  return (
    <CycloneScene
      scrollProgress={scrollProgress}
      prefersReducedMotion={prefersReducedMotion}
    />
  );
}
