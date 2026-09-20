'use client';
import type { SceneKind } from '@/types';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { ServiceScene } from '@/components/three/dynamic';
import { ServicePoster } from '@/components/three/Fallbacks';

/** One reusable 3D stage for any service. Used on the home showcase and every service page hero. */
export function ServiceStage({ kind, label, className }: { kind: SceneKind; label: string; className?: string }) {
  return (
    <SceneCanvas label={label} className={className} camera={{ position: [0, 0, kind === 'model' ? 5.5 : 7.2], fov: 45 }} fallback={<ServicePoster kind={kind} />}>
      {(q) => <ServiceScene key={kind} kind={kind} q={q} />}
    </SceneCanvas>
  );
}
