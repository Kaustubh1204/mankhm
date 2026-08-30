'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
  id: number;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export default function CycloneCursor() {
  const [enabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isTouch && !isReduced;
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Target position and current interpolated position
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  
  // Cursor state variables
  const rotation = useRef(0);
  const isHoverButton = useRef(false);
  const isHoverLink = useRef(false);
  const [scale, setScale] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(1);
  
  // Trail points & ripples
  const [trails, setTrails] = useState<TrailPoint[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (target) {
        const isBtn = !!target.closest('button, a.btn, [role="button"], .interactive-button');
        const isLnk = !isBtn && !!target.closest('a, [data-link]');
        const cardElem = target.closest('[data-card]') as HTMLElement | null;

        isHoverButton.current = isBtn;
        isHoverLink.current = isLnk;

        if (isBtn) {
          setScale(1.4);
          setGlowIntensity(1.6);
        } else if (isLnk) {
          setScale(1.25);
          setGlowIntensity(1.4);
        } else {
          setScale(1);
          setGlowIntensity(1);
        }

        if (cardElem) {
          const rect = cardElem.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const offsetX = (e.clientX - centerX) / (rect.width / 2);
          const offsetY = (e.clientY - centerY) / (rect.height / 2);
          
          cardElem.style.transform = `perspective(1000px) rotateY(${offsetX * 6}deg) rotateX(${-offsetY * 6}deg) translateZ(10px)`;
          cardElem.style.transition = 'transform 0.1s ease-out';
        }
      }
    };

    const handleMouseLeaveCard = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const cardElem = target.closest('[data-card]') as HTMLElement | null;
        if (cardElem) {
          cardElem.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
          cardElem.style.transition = 'transform 0.5s ease-out';
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rid = nextId.current++;
      setRipples((prev) => [...prev.slice(-4), { x: e.clientX, y: e.clientY, id: rid }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rid));
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseLeaveCard, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    let animationFrameId: number;
    let lastTrailTime = 0;

    const animate = (time: number) => {
      const ease = 0.18;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      const speed = isHoverButton.current ? 0.12 : 0.05;
      rotation.current = (rotation.current + speed) % (Math.PI * 2);
      const deg = (rotation.current * 180) / Math.PI;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${deg}deg)`;
      }

      const dist = Math.hypot(targetPos.current.x - currentPos.current.x, targetPos.current.y - currentPos.current.y);
      if (time - lastTrailTime > 50 && dist > 2) {
        lastTrailTime = time;
        const tid = nextId.current++;
        setTrails((prev) => [
          ...prev.slice(-4),
          {
            x: currentPos.current.x,
            y: currentPos.current.y,
            alpha: 0.5,
            size: isHoverButton.current ? 18 : 12,
            id: tid,
          },
        ]);
      }

      setTrails((prev) =>
        prev
          .map((t) => ({ ...t, alpha: t.alpha - 0.04, size: t.size * 0.95 }))
          .filter((t) => t.alpha > 0.05)
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeaveCard);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scale]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Subtle Trailing Traces */}
      {trails.map((t) => (
        <div
          key={t.id}
          className="absolute rounded-full border border-cyan-400/40 bg-cyan-300/10 pointer-events-none transition-opacity duration-100"
          style={{
            left: `${t.x}px`,
            top: `${t.y}px`,
            width: `${t.size}px`,
            height: `${t.size}px`,
            opacity: t.alpha,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 8px rgba(0, 225, 255, 0.3)',
          }}
        />
      ))}

      {/* Tiny Click Ripple Effects */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border border-cyan-300/80 pointer-events-none animate-ping"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '36px',
            height: '36px',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px rgba(0, 225, 255, 0.6)',
            animationDuration: '450ms',
          }}
        />
      ))}

      {/* Primary Small 3D Cyclone Cursor */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          willChange: 'transform',
        }}
      >
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: '24px',
            height: '24px',
            filter: `drop-shadow(0 0 ${6 * glowIntensity}px rgba(0, 215, 255, ${0.8 * glowIntensity}))`,
          }}
        >
          {/* Outer glowing aura ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse" />

          {/* 3D Cyclone Vortex SVG */}
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-full text-cyan-200 fill-current"
            style={{
              willChange: 'transform',
            }}
          >
            <defs>
              <linearGradient id="cycloneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Core Eye */}
            <circle cx="50" cy="50" r="7" fill="#ffffff" />

            {/* Spiral Vortex Arm 1 */}
            <path
              d="M 50 50 C 45 35, 30 25, 15 35 C 5 42, 10 60, 25 65 C 38 70, 48 58, 50 50 Z"
              fill="url(#cycloneGrad)"
              opacity="0.9"
            />
            {/* Spiral Vortex Arm 2 */}
            <path
              d="M 50 50 C 55 65, 70 75, 85 65 C 95 58, 90 40, 75 35 C 62 30, 52 42, 50 50 Z"
              fill="url(#cycloneGrad)"
              opacity="0.8"
            />
            {/* Spiral Vortex Arm 3 */}
            <path
              d="M 50 50 C 65 45, 75 30, 65 15 C 58 5, 40 10, 35 25 C 30 38, 42 48, 50 50 Z"
              fill="url(#cycloneGrad)"
              opacity="0.75"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
