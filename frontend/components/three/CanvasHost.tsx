'use client';
import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import type { Q3D } from './SceneCanvas';

export interface HostProps {
  q: Q3D;
  live: boolean;
  camera: { position: [number, number, number]; fov?: number };
  globalPointer?: boolean;
  children: (q: Q3D) => ReactNode;
}

/** The only module that statically imports @react-three/fiber (and therefore three.js). Loaded on demand. */
export default function CanvasHost({ q, live, camera, globalPointer, children }: HostProps) {
  return (
    <Canvas
      dpr={q.tier === 'high' ? [1, 1.75] : [1, 1.25]}
      frameloop={q.reduced ? 'demand' : live ? 'always' : 'never'}
      gl={{ antialias: q.tier === 'high', alpha: true, powerPreference: 'high-performance' }}
      camera={camera}
      performance={{ min: 0.5 }}
      eventSource={globalPointer ? document.body : undefined}
      eventPrefix={globalPointer ? 'client' : undefined}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>{children(q)}</Suspense>
    </Canvas>
  );
}
