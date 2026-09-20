import { cn } from '@/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-8 w-8', className)} aria-hidden>
      <path d="M16 2 28 9v14l-12 7L4 23V9z" fill="none" stroke="#D4AF37" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 22V10h6.2a3.6 3.6 0 0 1 0 7.2H11m6 0 4.5 4.8" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[1.15rem] font-bold tracking-tight text-bone">Riyadvi</span>
    </span>
  );
}
