import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getPosts, getRelatedPosts } from '@/lib/content';
import { Container, Section } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PostCard } from '@/components/sections/PostCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { formatDate } from '@/lib/utils';
import { site } from '@/lib/site';
import type { Block } from '@/types';

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getPost(params.slug);
  return p ? { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: 'article', publishedTime: p.date } } : {};
}

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-article">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2': return <h2 key={i}>{b.text}</h2>;
          case 'h3': return <h3 key={i}>{b.text}</h3>;
          case 'ul': return <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
          case 'quote': return <blockquote key={i}>{b.text}</blockquote>;
          default: return <p key={i}>{b.text}</p>;
        }
      })}
    </div>
  );
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.date, author: { '@type': 'Organization', name: post.author }, publisher: { '@type': 'Organization', name: site.name }, description: post.excerpt };
  return (
    <>
      <article className="pb-16 pt-32 md:pt-40">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.category }]} />
          <h1 className="max-w-4xl text-display-lg">{post.title}</h1>
          <p className="mt-5 text-dim">{post.author}, <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.readMinutes} min read</p>
          <div className="mt-12"><Body blocks={post.body} /></div>
          <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">{post.tags.map((t) => <li key={t}><Link href={`/blog?tag=${t}`} className="rounded-full border border-line px-3 py-1 text-sm text-muted hover:border-gold hover:text-gold">#{t}</Link></li>)}</ul>
        </Container>
      </article>
      <Section className="border-t border-line">
        <Container>
          <h2 className="text-display-md">Related articles</h2>
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <div key={p.slug} className="relative"><PostCard post={p} /></div>)}</div>
        </Container>
      </Section>
      <CtaBand title="Want this kind of thinking on your project?" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
