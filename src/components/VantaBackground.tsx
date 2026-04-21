'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Make THREE globally available before Vanta loads
if (typeof window !== 'undefined') {
  (window as unknown as { THREE: typeof THREE }).THREE = THREE;
}

/**
 * VantaBackground - Animated background using Vanta.js GLOBE effect.
 */
export function VantaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;
    let effect: { destroy: () => void } | null = null;

    const init = async () => {
      if (!containerRef.current || !mounted) return;

      try {
        // Ensure THREE is available globally
        if (typeof window !== 'undefined' && !(window as unknown as { THREE?: typeof THREE }).THREE) {
          (window as unknown as { THREE: typeof THREE }).THREE = THREE;
        }

        // Dynamic import Vanta GLOBE
        const vantaGlobe = await import('vanta/dist/vanta.globe.min');
        const GLOBE = vantaGlobe.default;

        if (!containerRef.current || !mounted) return;

        const isMobile = window.innerWidth < 768;

        effect = GLOBE({
          el: containerRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: isMobile ? 300 : 400,
          minWidth: isMobile ? 300 : 400,
          scale: isMobile ? 0.7 : 1,
          scaleMobile: 0.7,
          color: 0xfcfbfa,
          colorHex: 0xFF9933,
          color2: 0x0c0d0c,
          backgroundColor: 0xF7E3D7,
          backgroundAlpha: 1,
        });

        vantaRef.current = effect;
      } catch (err) {
        console.log('Vanta GLOBE initialization:', err);
      }
    };

    const timer = setTimeout(init, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (effect) {
        try {
          effect.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ zIndex: -10 }}
    />
  );
}