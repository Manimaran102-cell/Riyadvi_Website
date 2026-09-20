import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { PostCard } from '@/components/sections/PostCard';
import { Container } from '@/components/ui/Container';
import { getBlogFacets, getFeaturedPost, getPosts } from '@/lib/content';
import { formatDate, cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Blog', description: 'Practical articles on web development, digital marketing, 3D and product design from the Riyadvi team.', alternates: { canonical: '/blog' } };

export default async function BlogPage({ searchParams }: { searchParams: { q?: string; category?: string; tag?: string } }) {
  const { q, category, tag } = searchParams;
  const filtering = Boolean(q || category || tag);
  const [posts, facets, featured] = await Promise.all([getPosts({ q, category, tag }), getBlogFacets(), getFeaturedPost()]);
  const chip = (on: boolean) => cn('rounded-full border px-4 py-1.5 text-[0.95rem] transition-colors', on ? 'border-gold bg-gold text-black' : 'border-line text-muted hover:border-gold/60 hover:text-bone');
  const list = filtering ? posts : posts.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <PageHero title="Ideas for growing businesses" lead="Practical thinking on websites, apps, marketing and immersive technology." crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <Container className="pb-24">
        <div className="mb-10 space-y-6">
          <form action="/blog" method="get" role="search" className="flex max-w-xl gap-2">
            <label htmlFor="blog-q" className="sr-only">Search articles</label>
            <input id="blog-q" name="q" defaultValue={q} placeholder="Search articles" className="h-12 flex-1 rounded-full border border-line bg-surface px-5 text-bone placeholder:text-dim focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40" />
            <button type="submit" className="h-12 rounded-full bg-gold px-6 font-display font-semibold text-black hover:bg-gold-soft">Search</button>
          </form>
          <nav aria-label="Categories" className="flex flex-wrap gap-2">
            <Link href="/blog" className={chip(!category && !tag && !q)}>All</Link>
            {facets.categories.map((c) => <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={chip(category === c)}>{c}</Link>)}
          </nav>
          <nav aria-label="Tags" className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-dim">
            {facets.tags.map((t) => <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={cn('hover:text-gold', tag === t && 'text-gold')}>#{t}</Link>)}
          </nav>
        </div>

        {!filtering && (
          <article className="reg mb-14 grid gap-6 rounded-xl bg-surface p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="text-sm text-gold-soft">Featured, {featured.category}</p>
              <h2 className="mt-3 text-display-md"><Link href={`/blog/${featured.slug}`} className="hover:text-gold">{featured.title}</Link></h2>
              <p className="mt-4 max-w-[56ch] text-muted">{featured.excerpt}</p>
            </div>
            <p className="text-sm text-dim lg:text-right"><time dateTime={featured.date}>{formatDate(featured.date)}</time>, {featured.readMinutes} min read<br /><Link href={`/blog/${featured.slug}`} className="mt-3 inline-block text-base text-gold hover:underline">Read the article</Link></p>
          </article>
        )}

        {list.length === 0 ? (
          <div className="rounded-xl border border-line p-10 text-center"><p className="text-lg">No articles match your search.</p><Link href="/blog" className="mt-3 inline-block text-gold hover:underline">Clear filters</Link></div>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <div key={p.slug} className="relative"><PostCard post={p} /></div>)}</div>
        )}
      </Container>
    </>
  );
}
