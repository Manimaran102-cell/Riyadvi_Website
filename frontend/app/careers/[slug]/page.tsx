import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJob, getJobs } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { site } from '@/lib/site';

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const j = await getJob(params.slug);
  return j ? { title: `${j.title} - Careers`, description: j.summary, alternates: { canonical: `/careers/${j.slug}` } } : {};
}

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-10">
    <h2 className="font-display text-2xl font-semibold">{title}</h2>
    <ul className="mt-4 space-y-3">{items.map((i) => <li key={i} className="flex gap-3 text-muted"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{i}</li>)}</ul>
  </div>
);

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJob(params.slug);
  if (!job) notFound();
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'JobPosting', title: job.title, description: job.summary, datePosted: job.posted, employmentType: 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: site.name, sameAs: site.url },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } },
  };
  return (
    <>
      <section className="pb-10 pt-32 md:pt-40">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Careers', href: '/careers' }, { label: job.title }]} />
          <h1 className="max-w-4xl text-display-lg">{job.title}</h1>
          <p className="mt-5 max-w-[60ch] text-lg text-muted">{job.summary}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-gold/30 pt-6">
            {[['Department', job.department], ['Experience', job.experienceLabel], ['Location', job.location], ['Type', job.type]].map(([k, v]) => <div key={k}><dt className="text-sm text-dim">{k}</dt><dd className="font-display font-semibold">{v}</dd></div>)}
          </dl>
          <Button href="#apply" size="lg" className="mt-8">Apply for this role</Button>
        </Container>
      </section>
      <Container className="grid gap-14 pb-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <List title="Responsibilities" items={job.responsibilities} />
          <List title="Requirements" items={job.requirements} />
          {job.niceToHave && <List title="Nice to have" items={job.niceToHave} />}
        </div>
        <div id="apply" className="reg scroll-mt-28 self-start rounded-xl bg-surface p-6 sm:p-8">
          <h2 className="mb-6 text-display-md">Apply now</h2>
          <ApplicationForm position={job.title} jobSlug={job.slug} />
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
