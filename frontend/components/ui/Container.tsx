import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Container({ as: Tag = 'div', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={cn('mx-auto w-full max-w-shell px-5 sm:px-8', className)}>{children}</Tag>;
}

export function Section({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return <section id={id} className={cn('relative py-20 md:py-28', className)}>{children}</section>;
}

export function SectionHeading({ title, lead, className, id, as: Tag = 'h2' }: { title: string; lead?: string; className?: string; id?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <Tag id={id} className="text-display-lg text-bone">{title}</Tag>
      {lead && <p className="mt-5 max-w-[60ch] text-lg text-muted">{lead}</p>}
    </div>
  );
}
