import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LeadMagnetForm } from '@/components/forms/LeadMagnetForm';

export const metadata: Metadata = { title: 'Software Project Planning Guide', description: 'A practical, free guide to scoping, budgeting and running a software project without surprises.', alternates: { canonical: '/software-project-planning-guide' } };

const inside = [
  ['Write a one-page brief', 'A template that captures goals, users, scope and success measures.'],
  ['Scope without guesswork', 'Separate must-haves from nice-to-haves and phase the roadmap.'],
  ['Budget and timeline reality check', 'Typical ranges and the hidden costs teams forget.'],
  ['Choose the right partner', 'Questions to ask, red flags to avoid and how to compare proposals.'],
  ['Launch checklist', 'Everything to verify before go-live, and what to measure after.'],
];

export default function GuidePage() {
  return (
    <section className="relative pb-24 pt-32 md:pt-40">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Software Project Planning Guide' }]} />
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-display-lg">Download Software Project Planning Guide</h1>
            <p className="mt-6 max-w-[54ch] text-lg text-muted">Most software projects go off track before a line of code is written. This short guide shows how to plan, scope and budget yours so it stays on time and on target.</p>
            <h2 className="mt-12 font-display text-2xl font-semibold">What is inside</h2>
            <dl className="mt-6 space-y-5">
              {inside.map(([t, d]) => <div key={t} className="border-l-2 border-gold pl-5"><dt className="font-display text-lg font-semibold">{t}</dt><dd className="text-muted">{d}</dd></div>)}
            </dl>
          </div>
          <div className="reg self-start rounded-xl bg-surface p-6 sm:p-8 lg:sticky lg:top-28"><LeadMagnetForm /></div>
        </div>
      </Container>
    </section>
  );
}
