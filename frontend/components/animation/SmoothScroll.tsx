'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Shared handle so modals / drawers can pause smooth scrolling. */
export const smooth: { lenis: Lenis | null } = { lenis: null };

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock.
 * Disabled for users who prefer reduced motion (native scrolling is used instead).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.95 });
    smooth.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      smooth.lenis = null;
    };
  }, []);

  useEffect(() => {
    smooth.lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
