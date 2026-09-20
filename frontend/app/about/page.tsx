import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { AboutTimeline } from '@/components/sections/AboutTimeline';
import { CtaBand } from '@/components/sections/CtaBand';
import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { journey, milestones, values } from '@/data/milestones';

export const metadata: Metadata = { title: 'About', description: 'Riyadvi Software Technologies: a Chennai-based technology and digital solutions partner founded in 2021.', alternates: { canonical: '/about' } };

export default function AboutPage() {
  return (
    <>
      <PageHero title="A technology partner, not just a vendor" lead="Riyadvi was founded in Chennai in 2021 to help growing businesses turn technology into measurable growth." crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      <Section className="pt-0">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="prose-article">
            <h2>Our story</h2>
            <p>We began with a simple observation: most businesses do not need more software. They need the right software, delivered by people who understand their market and stay accountable after launch.</p>
            <p>Today a team of designers, engineers, marketers and 3D artists works as one unit, serving clients across India, Australia and the GCC. Over 80 projects later, the approach is unchanged: understand the business, design for real users, build carefully and keep improving.</p>
          </div>
          <div className="space-y-8 self-start">
            <div className="reg rounded-xl bg-surface p-8"><h2 className="font-display text-xl font-semibold text-gold">Vision</h2><p className="mt-2 text-muted">To be the most trusted and customer-centric technology company, building long-lasting relationships with the businesses we serve.</p></div>
            <div className="reg rounded-xl bg-surface p-8"><h2 className="font-display text-xl font-semibold text-gold">Mission</h2><p className="mt-2 text-muted">To deliver exceptional services and products that consistently exceed our customers&rsquo; expectations.</p></div>
          </div>
        </Container>
      </Section>

      <section className="border-y border-line" aria-label="Company timeline"><AboutTimeline milestones={milestones} /></section>

      <Section>
        <Container>
          <SectionHeading title="What we value" />
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {values.map((v) => <div key={v.title} className="border-t border-gold/30 pt-5"><dt className="font-display text-xl font-semibold">{v.title}</dt><dd className="mt-2 max-w-[46ch] text-muted">{v.body}</dd></div>)}
          </dl>
        </Container>
      </Section>

      <Section className="border-y border-line">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="How we work" />
            <ol className="mt-8 space-y-5">{journey.map((j, i) => <li key={j.label} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/50 font-display text-sm font-semibold text-gold">{i + 1}</span><div><p className="font-display text-lg font-semibold">{j.label}</p><p className="text-muted">{j.body}</p></div></li>)}</ol>
          </div>
          <div>
            <SectionHeading title="Recognition" />
            <div className="reg mt-8 rounded-xl bg-surface p-8">
              <p className="font-display text-2xl font-semibold text-gold">TechBehemoths 2025 Awards</p>
              <p className="mt-2 text-muted">Winner. Recognised by the B2B directory for delivery quality across web, mobile, marketing and AR/VR projects.</p>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand title="Let us build something together" />
    </>
  );
}
