/* eslint-disable */
'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CycloneModel from './CycloneModel';

interface Cyclone3DProps {
  scrollProgress?: number;
  cycloneCenterX?: number;
  onError?: () => void;
}

function CycloneModelWrapper({
  scrollProgress = 0,
  cycloneCenterX = 4.8,
}: {
  scrollProgress: number;
  cycloneCenterX: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow continuous Y-axis rotation
    groupRef.current.rotation.y += delta * 0.1;

    // Gentle vertical floating movement
    const floatY = Math.sin(state.clock.elapsedTime * 1.2) * 0.18;

    // Scroll progress-based positioning and scaling
    const progress = Math.min(Math.max(scrollProgress, 0), 1);
    const easeProgress = Math.pow(progress, 0.85);

    // X shifts from right (cycloneCenterX) to center (0.0)
    const currentX = THREE.MathUtils.lerp(cycloneCenterX, 0, Math.min(easeProgress * 2.2, 1));
    
    // Scale increases smoothly as it moves to center
    const currentScale = THREE.MathUtils.lerp(1.0, 2.5, Math.min(easeProgress * 1.8, 1));

    // Subtle mouse parallax
    const targetX = currentX + state.pointer.x * 0.28;
    const targetY = floatY + state.pointer.y * 0.18;

    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.06;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.06;
    groupRef.current.scale.setScalar(currentScale);

    // Camera scroll transition towards and through the hollow center/eye
    if (progress > 0.12) {
      const p = (progress - 0.12) / 0.88;
      const cameraZ = THREE.MathUtils.lerp(21, -8, p);
      const cameraY = THREE.MathUtils.lerp(15, 0.2, p);
      const cameraX = THREE.MathUtils.lerp(0, 0, p);

      camera.position.x += (cameraX - camera.position.x) * 0.08;
      camera.position.y += (cameraY - camera.position.y) * 0.08;
      camera.position.z += (cameraZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.x += (0 - camera.position.x) * 0.08;
      camera.position.y += (15 - camera.position.y) * 0.08;
      camera.position.z += (21 - camera.position.z) * 0.08;
      camera.lookAt(cycloneCenterX * 0.4, 0, 0);
    }
  });

  return (
    <group ref={groupRef} position={[cycloneCenterX, 0, 0]}>
      <CycloneModel />
    </group>
  );
}

class GLTFErrorBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { onError: () => void; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function Cyclone3D({
  scrollProgress = 0,
  cycloneCenterX = 4.8,
  onError,
}: Cyclone3DProps) {
  return (
    <GLTFErrorBoundary onError={onError || (() => {})}>
      <CycloneModelWrapper scrollProgress={scrollProgress} cycloneCenterX={cycloneCenterX} />
    </GLTFErrorBoundary>
  );
}
