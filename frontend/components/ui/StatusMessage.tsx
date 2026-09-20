import { cn } from '@/lib/utils';

export function FormAlert({ kind, children }: { kind: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cn('rounded-lg border px-4 py-3 text-[0.95rem]',
      kind === 'error' && 'border-danger/50 bg-danger/10 text-danger',
      kind === 'success' && 'border-ok/50 bg-ok/10 text-ok',
      kind === 'info' && 'border-gold/40 bg-gold/10 text-gold-soft')}>
      {children}
    </div>
  );
}
