import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
interface Common { variant?: Variant; size?: 'md' | 'lg'; className?: string; children: ReactNode }
type Props = Common & ({ href: string; external?: boolean } & { onClick?: never; type?: never; disabled?: never }) | (Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined });

const base = 'inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none select-none';
const variants: Record<Variant, string> = {
  primary: 'bg-gold text-black hover:bg-gold-soft active:bg-gold-deep',
  secondary: 'border border-gold/40 text-bone hover:border-gold hover:bg-gold/10',
  ghost: 'text-bone hover:text-gold',
};
const sizes = { md: 'h-11 px-6 text-[0.95rem]', lg: 'h-14 px-8 text-base' };

export function Button(props: Props) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);
  if ('href' in rest && rest.href !== undefined) {
    const { href, external } = rest as { href: string; external?: boolean };
    return external ? (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>
    ) : (
      <Link href={href} className={cls}>{children}</Link>
    );
  }
  return <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
