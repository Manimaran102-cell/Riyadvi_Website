'use client';
import { useEffect, useState } from 'react';

/**
 * Decides how much 3D a device can afford. This is the site's mobile 3D strategy:
 *  - 'static' : no WebGL, data-saver on or very low memory  -> designed fallback, no canvas at all
 *  - 'low'    : phones / low-core devices -> capped pixel ratio, fewer objects, simpler materials
 *  - 'high'   : capable desktops -> full quality
 * `reduced` (prefers-reduced-motion) freezes animation loops but keeps a single rendered frame.
 */
export type Tier = 'pending' | 'static' | 'low' | 'high';
export interface Quality { tier: Tier; reduced: boolean; coarse: boolean }

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (!hasWebGL() || nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)) return { tier: 'static', reduced, coarse };
  const small = window.innerWidth < 768;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4;
  return { tier: small || weak || coarse ? 'low' : 'high', reduced, coarse };
}

let cache: Quality | null = null;

export function useQualityTier(): Quality {
  const [q, setQ] = useState<Quality>(cache ?? { tier: 'pending', reduced: false, coarse: false });
  useEffect(() => {
    cache ??= detectQuality();
    setQ(cache);
  }, []);
  return q;
}
