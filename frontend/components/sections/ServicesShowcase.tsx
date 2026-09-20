'use client';
import { useState } from 'react';
import type { Service } from '@/types';
import { Container, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ServiceGlyph } from '@/components/three/Fallbacks';
import { ServiceStage } from './ServiceStage';
import { cn } from '@/lib/utils';

/** Six services, one shared 3D stage: choosing a service swaps the scene rather than mounting six WebGL contexts. */
export function ServicesShowcase({ services }: { services: Service[] }) {
  const [i, setI] = useState(0);
  const active = services[i];
  return (
    <section className="py-20 md:py-28" aria-labelledby="services-title">
      <Container>
        <SectionHeading id="services-title" title="Six ways we help you grow" lead="Pick a service to see it in 3D. Each has its own page with the problem, process, technology and related work." />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {services.map((s, idx) => (
                <li key={s.slug}>
                  <button type="button" aria-pressed={idx === i} onClick={() => setI(idx)} onMouseEnter={() => setI(idx)} onFocus={() => setI(idx)}
                    className={cn('flex w-full items-center gap-4 py-4 text-left transition-colors', idx === i ? 'text-bone' : 'text-muted hover:text-bone')}>
                    <ServiceGlyph kind={s.scene} className={cn('h-10 w-10 shrink-0 transition-opacity', idx === i ? 'opacity-100' : 'opacity-50')} />
                    <span className="flex-1">
                      <span className="block font-display text-xl font-semibold">{s.name}</span>
                      <span className={cn('block text-[0.95rem] text-dim transition-all', idx === i ? 'max-h-12 opacity-100' : 'max-h-0 overflow-hidden opacity-0 lg:max-h-12 lg:opacity-100')}>{s.tagline}</span>
                    </span>
                    <span aria-hidden className={cn('h-2 w-2 rotate-45 bg-gold transition-opacity', idx === i ? 'opacity-100' : 'opacity-0')} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8" aria-live="polite">
              <p className="max-w-[48ch] text-muted">{active.summary}</p>
              <Button href={`/services/${active.slug}`} className="mt-5">Explore {active.name}</Button>
            </div>
          </div>
          <div className="reg sticky top-24 aspect-square w-full overflow-hidden rounded-xl bg-surface/60 lg:aspect-[5/5.4]">
            <ServiceStage kind={active.scene} label={`Interactive 3D visual for ${active.name}`} className="absolute inset-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
