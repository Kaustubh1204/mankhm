'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/animations/heroScroll';

interface HeroTransitionProps {
  onScrollProgressUpdate: (progress: number) => void;
}

export default function HeroTransition({ onScrollProgressUpdate }: HeroTransitionProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        onScrollProgressUpdate(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [onScrollProgressUpdate]);

  return null;
}
