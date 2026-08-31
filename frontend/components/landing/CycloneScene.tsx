'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Cyclone3D from './Cyclone3D';
import CycloneFallback from './CycloneFallback';

interface CycloneSceneProps {
  scrollProgress?: number;
  prefersReducedMotion?: boolean;
}

export default function CycloneScene({
  scrollProgress = 0,
  prefersReducedMotion = false,
}: CycloneSceneProps) {
  const [hasWebGL] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return Boolean(gl);
    } catch {
      return false;
    }
  });

  const [hasModelError, setHasModelError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!hasWebGL || hasModelError) {
    return <CycloneFallback isMissingModel={hasModelError || !hasWebGL} />;
  }

  const cycloneCenterX = isMobile ? 0 : 4.8;
  const activeProgress = prefersReducedMotion ? 0 : scrollProgress;

  const fogDensity = 0.005 + Math.pow(activeProgress, 1.4) * 0.065;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0b132b]">
      <Canvas
        camera={{ position: [0, 15, 21], fov: 42 }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.25 : 2)}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <fogExp2 attach="fog" args={['#0b132b', fogDensity]} />

        {/* Soft 3-Point Cinematic Lighting for 3D Cyclone GLTF Model */}
        <ambientLight intensity={0.85} color="#f8fafc" />

        <directionalLight
          position={[14, 22, 16]}
          intensity={1.7}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <directionalLight position={[-14, -8, -10]} intensity={0.75} color="#38bdf8" />
        <pointLight position={[0, 2, -10]} intensity={0.6} color="#00b4d8" />

        <Suspense fallback={null}>
          <Cyclone3D
            scrollProgress={activeProgress}
            cycloneCenterX={cycloneCenterX}
            onError={() => setHasModelError(true)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
