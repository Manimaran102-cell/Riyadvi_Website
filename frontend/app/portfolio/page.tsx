import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { Container } from '@/components/ui/Container';
import { getProjects, getServices } from '@/lib/content';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Portfolio', description: 'Selected websites, apps and immersive experiences delivered by Riyadvi.', alternates: { canonical: '/portfolio' } };

export default async function PortfolioPage({ searchParams }: { searchParams: { service?: string } }) {
  const [all, services] = await Promise.all([getProjects(), getServices()]);
  const filter = searchParams.service;
  const projects = filter ? all.filter((p) => p.services.includes(filter)) : all;
  const chip = (on: boolean) => cn('rounded-full border px-4 py-2 text-[0.95rem] transition-colors', on ? 'border-gold bg-gold text-black' : 'border-line text-muted hover:border-gold/60 hover:text-bone');
  const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];
  return (
    <>
      <PageHero title="Work that moves businesses forward" lead="A selection of projects across healthcare, retail, real estate, biotech and consumer technology." crumbs={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]} />
      <Container className="pb-20">
        <nav aria-label="Filter by service" className="mb-10 flex flex-wrap gap-2">
          <Link href="/portfolio" className={chip(!filter)} aria-current={!filter ? 'true' : undefined}>All</Link>
          {services.map((s) => <Link key={s.slug} href={`/portfolio?service=${s.slug}`} className={chip(filter === s.slug)} aria-current={filter === s.slug ? 'true' : undefined}>{s.name}</Link>)}
        </nav>
        {projects.length === 0 ? <p className="text-muted">No projects match this filter yet.</p> : (
          <div className="grid gap-5 lg:grid-cols-12">
            {projects.map((p, i) => <ProjectCard key={p.slug} project={p} className={filter ? 'lg:col-span-6' : spans[i % 4]} />)}
          </div>
        )}
      </Container>
      <CtaBand title="Have a project in mind?" />
    </>
  );
}
