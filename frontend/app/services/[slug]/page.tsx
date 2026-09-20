import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectsBySlugs, getService, getServices } from '@/lib/content';
import { ServiceTemplate } from '@/components/sections/ServiceTemplate';

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = await getService(params.slug);
  if (!s) return {};
  return { title: s.name, description: s.summary, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) notFound();
  const related = await getProjectsBySlugs(service.relatedProjects);
  return <ServiceTemplate service={service} related={related} />;
}
