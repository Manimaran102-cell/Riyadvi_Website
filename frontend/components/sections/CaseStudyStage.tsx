'use client';
import type { Project } from '@/types';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { CaseStudyScene } from '@/components/three/dynamic';
import { ProjectVisual } from '@/components/three/Fallbacks';

/** Interactive 3D device presentation for a case study; falls back to the 2D visual on weak devices. */
export function CaseStudyStage({ project }: { project: Project }) {
  return (
    <SceneCanvas label={`Interactive 3D presentation of the ${project.name} interface on laptop and phone. Drag to rotate.`} className="absolute inset-0" camera={{ position: [0, 1.2, 7.2], fov: 42 }}
      fallback={<div className="absolute inset-0 grid place-items-center p-6"><ProjectVisual name={project.name} accent={project.accent} className="aspect-[16/10] w-full max-w-xl" /></div>}>
      {(q) => <CaseStudyScene project={project} q={q} />}
    </SceneCanvas>
  );
}
