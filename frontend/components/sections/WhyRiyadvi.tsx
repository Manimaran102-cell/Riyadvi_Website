'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Milestone } from '@/types';
import { Container, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { journey } from '@/data/milestones';
import { cn } from '@/lib/utils';

export function WhyRiyadvi({ milestones }: { milestones: Milestone[] }) {
  const [i, setI] = useState(0);
  const m = milestones[i];
  return (
    <section className="py-20 md:py-28" aria-labelledby="why-title">
      <Container>
        <SectionHeading id="why-title" title="Why growing businesses choose Riyadvi" lead="A partner that stays past launch: strategy, design, engineering and marketing under one roof." />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-semibold">Since 2021</h3>
            <div role="tablist" aria-label="Company journey" className="mt-5 flex gap-1 overflow-x-auto border-b border-line scrollbar-none">
              {milestones.map((x, idx) => (
                <button key={x.year} role="tab" aria-selected={idx === i} aria-controls="journey-panel" id={`tab-${x.year}`} onClick={() => setI(idx)}
                  className={cn('relative shrink-0 px-4 py-3 font-display text-lg font-semibold transition-colors', idx === i ? 'text-gold' : 'text-dim hover:text-bone')}>
                  {x.year}
                  {idx === i && <motion.span layoutId="year-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />}
                </button>
              ))}
            </div>
            <div id="journey-panel" role="tabpanel" aria-labelledby={`tab-${m.year}`} className="min-h-[9rem] pt-6">
              <AnimatePresence mode="wait">
                <motion.div key={m.year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <h4 className="text-display-md">{m.title}</h4>
                  <p className="mt-3 max-w-[52ch] text-muted">{m.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="reg rounded-xl bg-surface p-8 sm:p-10">
            <h3 className="text-display-md">Business Health Checkup</h3>
            <p className="mt-4 max-w-[46ch] text-muted">Six short steps review your website, marketing and technology, then score your digital readiness and show where the biggest opportunities are. Free, and takes about five minutes.</p>
            <Button href="/business-health-checkup" size="lg" className="mt-7">Start the checkup</Button>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-display text-2xl font-semibold">End-to-end solutions</h3>
          <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
            {journey.map((s, idx) => (
              <li key={s.label} className="relative lg:pr-6">
                <div className="mb-4 hidden items-center lg:flex">
                  <span className="h-3 w-3 shrink-0 rotate-45 bg-gold" />
                  {idx < journey.length - 1 && <span className="ml-2 h-px flex-1 bg-gradient-to-r from-gold/60 to-line" />}
                </div>
                <p className="font-display text-lg font-semibold"><span className="mr-2 text-gold lg:hidden">{idx + 1}.</span>{s.label}</p>
                <p className="mt-1 text-[0.95rem] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
