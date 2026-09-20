import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getJobs, getPosts, getProjects, getServices } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts, jobs] = await Promise.all([getServices(), getProjects(), getPosts(), getJobs()]);
  const fixed = ['', '/services', '/portfolio', '/about', '/blog', '/careers', '/contact', '/business-health-checkup', '/software-project-planning-guide'];
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/portfolio/${p.slug}`, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date, priority: 0.5 })),
    ...jobs.map((j) => ({ url: `${site.url}/careers/${j.slug}`, lastModified: j.posted, priority: 0.4 })),
  ];
}
