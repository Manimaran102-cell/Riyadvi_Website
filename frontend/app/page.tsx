import { Hero } from '@/components/sections/Hero';
import { TransformationStory } from '@/components/sections/TransformationStory';
import { ServicesShowcase } from '@/components/sections/ServicesShowcase';
import { TechEcosystem } from '@/components/sections/TechEcosystem';
import { WhyRiyadvi } from '@/components/sections/WhyRiyadvi';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { Container, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getProjectsBySlugs, getServices } from '@/lib/content';
import { technologies } from '@/data/technologies';
import { milestones } from '@/data/milestones';

export default async function HomePage() {
  const [services, featured] = await Promise.all([getServices(), getProjectsBySlugs(['wanaromah', 'laxmi-astro-ai', 'pearl-housing', 'cube-dental'])]);
  const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];
  return (
    <>
      <Hero />
      <TransformationStory />
      <ServicesShowcase services={services} />
      <TechEcosystem techs={technologies} />
      <WhyRiyadvi milestones={milestones} />
      <section className="py-20 md:py-28" aria-labelledby="work-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="work-title" title="Recent work" lead="Websites, apps and immersive experiences delivered for clinics, retailers, developers and start-ups." />
            <Button href="/portfolio" variant="secondary">View all projects</Button>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            {featured.map((p, i) => <ProjectCard key={p.slug} project={p} className={spans[i]} />)}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
