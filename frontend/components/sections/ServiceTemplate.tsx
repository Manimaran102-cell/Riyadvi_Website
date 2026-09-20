import type { Project, Service } from '@/types';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { ConsultButton } from '@/components/ui/ConsultButton';
import { ServiceStage } from './ServiceStage';
import { ProjectCard } from './ProjectCard';

/** The one template behind all six /services/[slug] pages. Content comes entirely from the Service record. */
export function ServiceTemplate({ service: s, related }: { service: Service; related: Project[] }) {
  const quote = `/contact?service=${s.slug}&intent=quote`;
  const hint = s.scene === 'model' ? 'Drag to rotate. Click the object to toggle wireframe.' : s.scene === 'web' || s.scene === 'app' || s.scene === 'uiux' ? 'Move your cursor over the scene.' : 'Interactive 3D preview.';
  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-32 md:pt-36">
        <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: s.name }]} />
            <h1 className="text-display-xl">{s.hero.headline}</h1>
            <p className="mt-6 max-w-[54ch] text-lg text-muted md:text-xl">{s.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={quote} size="lg">Get a Quote</Button>
              <ConsultButton variant="secondary" size="lg" topic={s.slug} />
            </div>
          </div>
          <div>
            <div className="reg relative aspect-[5/4] w-full overflow-hidden rounded-xl bg-surface/60">
              <ServiceStage kind={s.scene} label={`Interactive 3D visual for ${s.name}`} className="absolute inset-0" />
            </div>
            <p className="mt-3 text-sm text-dim">{hint}</p>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-display-lg">{s.problem.title}</h2>
            <p className="mt-5 max-w-[54ch] text-lg text-muted">{s.problem.body}</p>
            <ul className="mt-6 space-y-3">
              {s.problem.points.map((p) => <li key={p} className="flex gap-3 text-bone/90"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-danger" />{p}</li>)}
            </ul>
          </div>
          <div className="reg self-start rounded-xl bg-surface p-8 sm:p-10">
            <h2 className="text-display-md text-gold">{s.solution.title}</h2>
            <p className="mt-4 text-lg text-muted">{s.solution.body}</p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-line">
        <Container>
          <SectionHeading title={`What you get with ${s.name.toLowerCase()}`} />
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {s.features.map((f) => (
              <div key={f.title} className="border-t border-gold/30 pt-5">
                <dt className="font-display text-xl font-semibold">{f.title}</dt>
                <dd className="mt-2 max-w-[48ch] text-muted">{f.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading title="Where it works best" />
            <h3 className="mt-12 font-display text-xl font-semibold">Technology we use</h3>
            <ul className="mt-4 flex flex-wrap gap-2">{s.stack.map((t) => <li key={t} className="rounded-full border border-gold/40 px-4 py-1.5 text-[0.95rem] text-bone">{t}</li>)}</ul>
          </div>
          <ul className="divide-y divide-line self-start border-y border-line">
            {s.useCases.map((u) => (
              <li key={u.industry} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <h3 className="font-display text-lg font-semibold text-gold">{u.industry}</h3>
                <p className="text-muted">{u.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="border-y border-line">
        <Container>
          <SectionHeading title="How we work" lead="A clear sequence with a checkpoint at every stage, so you always know what happens next." />
          <ol className="mt-12 grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
            {s.process.map((p, i) => (
              <li key={p.title} className="relative">
                <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 font-display text-sm font-semibold text-gold">{i + 1}</span><span className="hidden h-px flex-1 bg-line md:block" /></div>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-[0.95rem] text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section>
          <Container>
            <SectionHeading title="Related work" />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{related.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
          </Container>
        </Section>
      )}

      <Section className="pt-0">
        <Container>
          <div className="reg rounded-2xl border border-gold/20 bg-surface px-6 py-14 text-center sm:px-14">
            <h2 className="mx-auto max-w-2xl text-display-lg">Let us scope your {s.name.toLowerCase()} project</h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-lg text-muted">Share a few details and get a clear, itemised quote, usually within two business days.</p>
            <div className="mt-8 flex justify-center gap-3"><Button href={quote} size="lg">Get a Quote</Button></div>
          </div>
        </Container>
      </Section>
    </>
  );
}
