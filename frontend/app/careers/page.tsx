import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { getJobFacets, getJobs } from '@/lib/content';
import { cn, formatDate } from '@/lib/utils';
import type { ExperienceBand } from '@/types';

export const metadata: Metadata = { title: 'Careers', description: 'Join Riyadvi: open roles in engineering, design, creative technology, marketing and sales.', alternates: { canonical: '/careers' } };

type SP = { department?: string; designation?: string; experience?: string };

export default async function CareersPage({ searchParams }: { searchParams: SP }) {
  const facets = await getJobFacets();
  const exp = facets.experience.find((e) => e.value === searchParams.experience)?.value as ExperienceBand | undefined;
  const jobs = await getJobs({ department: searchParams.department, designation: searchParams.designation, experience: exp });

  // Build a filter link that toggles one key and keeps the others.
  const href = (key: keyof SP, value: string) => {
    const next: SP = { ...searchParams, [key]: searchParams[key] === value ? undefined : value };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return `/careers${qs ? `?${qs}` : ''}`;
  };
  const chip = (on: boolean) => cn('rounded-full border px-4 py-1.5 text-[0.95rem] transition-colors', on ? 'border-gold bg-gold text-black' : 'border-line text-muted hover:border-gold/60 hover:text-bone');
  const group = (label: string, key: keyof SP, items: { value: string; label: string }[]) => (
    <div>
      <h2 className="mb-2 text-sm text-dim">{label}</h2>
      <div className="flex flex-wrap gap-2">{items.map((i) => <Link key={i.value} href={href(key, i.value)} className={chip(searchParams[key] === i.value)} aria-current={searchParams[key] === i.value ? 'true' : undefined}>{i.label}</Link>)}</div>
    </div>
  );
  const active = Object.values(searchParams).some(Boolean);

  return (
    <>
      <PageHero title="Build your career with us" lead="We hire curious people who care about craft and clients. Find a role, or send us your profile." crumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]} />
      <Container className="pb-24">
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {group('Department', 'department', facets.departments.map((d) => ({ value: d, label: d })))}
          {group('Designation', 'designation', facets.designations.map((d) => ({ value: d, label: d })))}
          {group('Experience', 'experience', facets.experience)}
        </div>
        <p className="mb-4 text-sm text-dim" aria-live="polite">{jobs.length} open {jobs.length === 1 ? 'role' : 'roles'}{active && <> &middot; <Link href="/careers" className="text-gold hover:underline">Clear filters</Link></>}</p>
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-line p-10 text-center"><p className="text-lg">No roles match those filters.</p><p className="mt-2 text-muted">Try clearing a filter, or email your profile to <a className="text-gold hover:underline" href="mailto:info@riyadvisoftwaretechnologies.com">info@riyadvisoftwaretechnologies.com</a>.</p></div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {jobs.map((j) => (
              <li key={j.slug}>
                <Link href={`/careers/${j.slug}`} className="group grid gap-2 py-6 transition-colors hover:bg-gold/5 md:grid-cols-[1.4fr_1fr_auto] md:items-center md:gap-8 md:px-4">
                  <div><h3 className="font-display text-xl font-semibold group-hover:text-gold">{j.title}</h3><p className="mt-1 max-w-[60ch] text-[0.95rem] text-muted">{j.summary}</p></div>
                  <p className="text-[0.95rem] text-muted">{j.department}<br /><span className="text-dim">{j.experienceLabel}, {j.location}</span></p>
                  <p className="text-sm text-dim">Posted {formatDate(j.posted)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
