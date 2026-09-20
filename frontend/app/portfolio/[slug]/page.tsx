import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects, getServices } from '@/lib/content';
import { Container, Section } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProjectVisual } from '@/components/three/Fallbacks';
import { CaseStudyStage } from '@/components/sections/CaseStudyStage';
import { CtaBand } from '@/components/sections/CtaBand';

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProject(params.slug);
  return p ? { title: `${p.name} case study`, description: p.summary, alternates: { canonical: `/portfolio/${p.slug}` } } : {};
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const [project, all, services] = await Promise.all([getProject(params.slug), getProjects(), getServices()]);
  if (!project) notFound();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];
  const related = services.filter((s) => project.services.includes(s.slug));
  const facts: [string, string][] = [['Client', project.client], ['Industry', project.industry], ['Year', project.year]];

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-36">
        <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Portfolio', href: '/portfolio' }, { label: project.name }]} />
          <h1 className="text-display-xl">{project.name}</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-muted md:text-xl">{project.summary}</p>
          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-gold/30 pt-6">
            {facts.map(([k, v]) => <div key={k}><dt className="text-sm text-dim">{k}</dt><dd className="font-display text-lg font-semibold">{v}</dd></div>)}
          </dl>
        </Container>
      </section>

      <Container>
        {project.scene3d ? (
          <>
            <div className="reg relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface/60 sm:aspect-[16/8]"><CaseStudyStage project={project} /></div>
            <p className="mt-3 text-sm text-dim">Interactive presentation: drag to rotate the devices.</p>
          </>
        ) : (
          <ProjectVisual name={project.name} accent={project.accent} className="aspect-[16/9] w-full sm:aspect-[16/8]" />
        )}
      </Container>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-2">
          <div><h2 className="text-display-md">The challenge</h2><p className="mt-4 max-w-[54ch] text-lg text-muted">{project.challenge}</p></div>
          <div><h2 className="text-display-md text-gold">Our solution</h2><p className="mt-4 max-w-[54ch] text-lg text-muted">{project.solution}</p></div>
        </Container>
      </Section>

      <Section className="border-y border-line">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-display-md">Technologies</h2>
            <ul className="mt-5 flex flex-wrap gap-2">{project.technologies.map((t) => <li key={t} className="rounded-full border border-gold/40 px-4 py-1.5 text-[0.95rem]">{t}</li>)}</ul>
          </div>
          <div>
            <h2 className="text-display-md">What we delivered</h2>
            <ul className="mt-5 space-y-3">{project.results.map((r) => <li key={r} className="flex gap-3 text-lg text-bone/90"><span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{r}</li>)}</ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-display-md">Related services</h2>
          <ul className="mt-6 flex flex-wrap gap-3">{related.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="inline-block rounded-full border border-line px-5 py-2.5 hover:border-gold hover:text-gold">{s.name}</Link></li>)}</ul>
          <div className="mt-14 flex items-center justify-between border-t border-line pt-6">
            <Link href="/portfolio" className="text-muted hover:text-gold">All projects</Link>
            <Link href={`/portfolio/${next.slug}`} className="text-right font-display text-lg font-semibold hover:text-gold"><span className="block text-sm font-normal text-dim">Next project</span>{next.name}</Link>
          </div>
        </Container>
      </Section>
      <CtaBand title={`Want results like ${project.name}'s?`} />
    </>
  );
}
