'use client';
import { Component, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useQualityTier } from '@/hooks/useQualityTier';
import { useInView, usePageVisible } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

// Loaded lazily so three.js never ships in the initial bundle (or at all on 'static' devices).
const CanvasHost = dynamic(() => import('./CanvasHost'), { ssr: false });

export interface Q3D { tier: 'low' | 'high'; reduced: boolean; coarse: boolean }

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.warn('3D scene failed, showing fallback:', err); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

interface Props {
  children: (q: Q3D) => ReactNode;
  /** Shown while resolving, on devices without WebGL / with data-saver, and if the scene throws. */
  fallback: ReactNode;
  className?: string;
  label: string;
  camera?: { position: [number, number, number]; fov?: number };
  /** Track the pointer over the whole page (used by the hero so text does not block interaction). */
  globalPointer?: boolean;
}

/**
 * Single entry point for every 3D scene. It owns the performance policy:
 *  - lazy: only mounts a <Canvas> once the device tier is known (never during SSR)
 *  - tiered: pixel ratio + antialiasing depend on the tier; 'static' devices never load WebGL
 *  - paused: the render loop stops when off-screen or in a background tab
 *  - reduced motion: renders a single frame ('demand')
 *  - resilient: a WebGL/runtime error falls back to the designed static view
 */
export function SceneCanvas({ children, fallback, className, label, camera = { position: [0, 0, 7], fov: 45 }, globalPointer }: Props) {
  const { tier, reduced, coarse } = useQualityTier();
  const [ref, inView] = useInView<HTMLDivElement>('120px');
  const visible = usePageVisible();
  const live = tier === 'low' || tier === 'high';

  return (
    <div ref={ref} className={cn('relative', className)} role="group" aria-label={label}>
      {!live ? fallback : (
        <Boundary fallback={fallback}>
          <div className="route-in absolute inset-0">
            <CanvasHost q={{ tier: tier as 'low' | 'high', reduced, coarse }} live={inView && visible} camera={camera} globalPointer={globalPointer}>{children}</CanvasHost>
          </div>
        </Boundary>
      )}
    </div>
  );
}
