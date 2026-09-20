import Link from 'next/link';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-dim">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="hover:text-gold">{it.label}</Link> : <span aria-current="page" className="text-muted">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden className="text-line">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
