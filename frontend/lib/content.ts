import { jobs } from '@/data/jobs';
import { posts } from '@/data/blog';
import { projects } from '@/data/portfolio';
import { services } from '@/data/services';
import type { ExperienceBand, Job, Post, Project, Service } from '@/types';

/**
 * Content access layer.
 * Every page reads content through these async functions, never from the data files directly.
 * To move to Strapi / Sanity / WordPress / a database, re-implement these functions
 * (e.g. `fetch(`${CMS_URL}/services`)`) and keep the return types: no page needs to change.
 */

/* ---------- Services ---------- */
export const getServices = async (): Promise<Service[]> => services;
export const getService = async (slug: string): Promise<Service | undefined> => services.find((s) => s.slug === slug);

/* ---------- Portfolio ---------- */
export const getProjects = async (): Promise<Project[]> => projects;
export const getProject = async (slug: string) => projects.find((p) => p.slug === slug);
export const getProjectsBySlugs = async (slugs: string[]) => slugs.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p));
export const getProjectsForService = async (serviceSlug: string) => projects.filter((p) => p.services.includes(serviceSlug));

/* ---------- Blog ---------- */
export interface PostQuery { q?: string; category?: string; tag?: string }
export async function getPosts(query: PostQuery = {}): Promise<Post[]> {
  const q = query.q?.trim().toLowerCase();
  return posts
    .filter((p) => !query.category || p.category === query.category)
    .filter((p) => !query.tag || p.tags.includes(query.tag))
    .filter((p) => !q || [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date));
}
export const getPost = async (slug: string) => posts.find((p) => p.slug === slug);
export const getFeaturedPost = async () => posts.find((p) => p.featured) ?? posts[0];
export const getBlogFacets = async () => ({
  categories: Array.from(new Set(posts.map((p) => p.category))).sort(),
  tags: Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
});
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map((x) => x.p);
}

/* ---------- Careers ---------- */
export interface JobQuery { department?: string; designation?: string; experience?: ExperienceBand }
export async function getJobs(query: JobQuery = {}): Promise<Job[]> {
  return jobs
    .filter((j) => !query.department || j.department === query.department)
    .filter((j) => !query.designation || j.designation === query.designation)
    .filter((j) => !query.experience || j.experience === query.experience)
    .sort((a, b) => b.posted.localeCompare(a.posted));
}
export const getJob = async (slug: string) => jobs.find((j) => j.slug === slug);
export const getJobFacets = async () => ({
  departments: Array.from(new Set(jobs.map((j) => j.department))).sort(),
  designations: Array.from(new Set(jobs.map((j) => j.designation))).sort(),
  experience: [
    { value: 'fresher', label: '0 to 1 year' },
    { value: '1-3', label: '1 to 3 years' },
    { value: '3-5', label: '3 to 5 years' },
    { value: '5+', label: '5+ years' },
  ] as { value: ExperienceBand; label: string }[],
});
