'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AtmosphericSceneProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
}

export default function AtmosphericScene({
  scrollProgress,
  prefersReducedMotion = false,
}: AtmosphericSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b19, 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x0077b6, 1.2);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00b4d8, 3, 50);
    cyanPointLight.position.set(10, 15, 10);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x030611, 4, 60);
    bluePointLight.position.set(-15, -10, -10);
    scene.add(bluePointLight);

    // 3. 3D GIS Grid Plane
    const gridHelper = new THREE.GridHelper(80, 40, 0x00b4d8, 0x1e2942);
    gridHelper.position.y = -8;
    gridHelper.rotation.x = 0.2;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // 4. Atmospheric Ribbons
    const ribbonGroup = new THREE.Group();

    const createRibbon = (offsetY: number, radiusScale: number, colorHex: number) => {
      const points: THREE.Vector3[] = [];
      const count = 60;
      for (let i = 0; i <= count; i++) {
        const t = (i / count) * Math.PI * 4;
        const x = Math.sin(t) * (12 + radiusScale);
        const y = offsetY + Math.cos(t * 0.5) * 3;
        const z = (i / count - 0.5) * 40;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.18, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.65,
        wireframe: true,
      });
      return new THREE.Mesh(tubeGeo, tubeMat);
    };

    const ribbon1 = createRibbon(2, 2, 0x00b4d8);
    const ribbon2 = createRibbon(-2, -1, 0x0077b6);
    const ribbon3 = createRibbon(5, 4, 0x38bdf8);
    ribbonGroup.add(ribbon1, ribbon2, ribbon3);
    scene.add(ribbonGroup);

    // 5. Soft Data Beacon Nodes
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.35,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(geometry, pMaterial);
    scene.add(particleSystem);

    // Mouse Parallax Listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      if (!prefersReducedMotion) {
        ribbonGroup.rotation.y = elapsedTime * 0.04;
        ribbonGroup.rotation.z = Math.sin(elapsedTime * 0.1) * 0.05;
        particleSystem.rotation.y = elapsedTime * 0.015;
      }

      const targetCamX = mouseRef.current.x * 2;
      const targetCamY = mouseRef.current.y * 1.5 + 5;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Scroll progress listener
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060b19]"
      aria-hidden="true"
    />
  );
}
