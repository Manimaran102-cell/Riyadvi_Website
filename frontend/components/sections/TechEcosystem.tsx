'use client';
import { useState } from 'react';
import type { Tech } from '@/types';
import { Container, SectionHeading } from '@/components/ui/Container';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { TechConstellation } from '@/components/three/dynamic';

function TechList({ techs }: { techs: Tech[] }) {
  return (
    <ul className="absolute inset-0 flex flex-wrap content-center justify-center gap-2 p-6">
      {techs.map((t) => <li key={t.name} className="rounded-full border border-gold/40 px-4 py-2 text-[0.95rem] text-bone">{t.name}</li>)}
    </ul>
  );
}

export function TechEcosystem({ techs }: { techs: Tech[] }) {
  const [active, setActive] = useState<Tech | null>(null);
  return (
    <section className="overflow-hidden border-y border-line py-20 md:py-28" aria-labelledby="tech-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.3fr] lg:items-center">
          <div>
            <SectionHeading id="tech-title" title="A technology stack chosen for your goals" lead="We pick tools for the problem rather than the trend. Hover, focus or drag the constellation to explore what we build with." />
            <div className="mt-8 min-h-[5.5rem]" aria-live="polite">
              {active ? (
                <div>
                  <p className="font-display text-2xl font-semibold text-gold">{active.name}</p>
                  <p className="text-muted">{active.category}: {active.blurb}</p>
                </div>
              ) : (
                <p className="text-dim">Select a technology to see how we use it.</p>
              )}
            </div>
          </div>
          <div className="relative aspect-square w-full lg:aspect-[6/5]">
            <SceneCanvas label="Interactive 3D constellation of technologies Riyadvi works with" className="absolute inset-0" camera={{ position: [0, 2.2, 9.6], fov: 45 }} fallback={<TechList techs={techs} />}>
              {(q) => <TechConstellation techs={techs} active={active?.name ?? null} onSelect={setActive} q={q} />}
            </SceneCanvas>
          </div>
        </div>
      </Container>
    </section>
  );
}
