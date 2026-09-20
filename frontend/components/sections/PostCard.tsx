import Link from 'next/link';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col border-t border-gold/30 pt-5">
      <p className="text-sm text-gold-soft">{post.category}</p>
      <h3 className="mt-2 font-display text-xl font-semibold leading-snug"><Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-gold">{post.title}</Link></h3>
      <p className="mt-3 flex-1 text-[0.95rem] text-muted">{post.excerpt}</p>
      <p className="mt-4 text-sm text-dim"><time dateTime={post.date}>{formatDate(post.date)}</time>, {post.readMinutes} min read</p>
    </article>
  );
}
