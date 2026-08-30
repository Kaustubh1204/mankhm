'use client';

import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CycloneModelProps {
  onLoadSuccess?: () => void;
}

export default function CycloneModel({ onLoadSuccess }: CycloneModelProps) {
  const { scene } = useGLTF('/models/cyclone.glb');

  // Pre-process materials for soft, non-metallic stylized 3D cloud shading
  const clonedScene = useMemo(() => {
    if (onLoadSuccess) onLoadSuccess();
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.roughness = Math.max(mat.roughness || 0.85, 0.7);
            mat.metalness = 0.0;
          }
        }
      }
    });
    return clone;
  }, [scene, onLoadSuccess]);

  return <primitive object={clonedScene} />;
}

useGLTF.preload('/models/cyclone.glb');
