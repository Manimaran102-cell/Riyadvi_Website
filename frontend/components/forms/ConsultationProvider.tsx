'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { api } from '@/lib/api';
import { check, consultationSchema } from '@/lib/validation';
import { requirementOptions, timeSlots } from '@/lib/options';
import { site } from '@/lib/site';
import { Button } from '@/components/ui/Button';
import { FormAlert } from '@/components/ui/StatusMessage';
import { Honeypot, ChoiceField, SelectField, TextField } from './fields';
import { useFormSubmit } from './useFormSubmit';

interface Ctx { open: (topic?: string) => void; close: () => void }
const ConsultationCtx = createContext<Ctx>({ open: () => undefined, close: () => undefined });
export const useConsultation = () => useContext(ConsultationCtx);

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const open = useCallback((t?: string) => { setTopic(t ?? ''); setOpen(true); }, []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);
  return (
    <ConsultationCtx.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen && <ConsultationModal topic={topic} onClose={close} />}</AnimatePresence>
    </ConsultationCtx.Provider>
  );
}

function ConsultationModal({ topic, onClose }: { topic: string; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [v, setV] = useState({ name: '', email: '', phone: '', company: '', topic, preferredDate: '', preferredTime: '', hp: '' });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const f = useFormSubmit();
  const today = new Date().toISOString().slice(0, 10);

  // Modal a11y: focus in, trap Tab, close on Escape, restore focus, lock page scroll.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([tabindex="-1"]),select,textarea') ?? []);
    focusables()[1]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prev?.focus(); };
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = check(consultationSchema, v);
    if (!r.ok) return f.fail(r.errors);
    await f.run(() => api.consultation({ ...r.data, hp: v.hp }));
  }

  return (
    <motion.div className="fixed inset-0 z-[70] grid place-items-end bg-black/80 backdrop-blur-sm sm:place-items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="consult-title" data-lenis-prevent initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="reg max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-surface p-6 sm:rounded-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="consult-title" className="text-display-md">Book a free consultation</h2>
            <p className="mt-2 text-muted">Tell us a little about your goals. We will confirm a 30-minute call within one business day.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted hover:border-gold hover:text-gold">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="m3 3 10 10M13 3 3 13" /></svg>
          </button>
        </div>

        {f.status === 'success' ? (
          <div role="status" className="space-y-4">
            <FormAlert kind="success">Request received. We will email you to confirm your slot.</FormAlert>
            {site.calendly && <Button href={site.calendly} external variant="secondary" className="w-full">Prefer to pick a time now? Open Calendly</Button>}
            <Button onClick={onClose} className="w-full">Close</Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" required autoComplete="name" value={v.name} onChange={set('name')} error={f.errors.name} />
              <TextField label="Phone" type="tel" required autoComplete="tel" value={v.phone} onChange={set('phone')} error={f.errors.phone} />
            </div>
            <TextField label="Email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} error={f.errors.email} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Company" autoComplete="organization" value={v.company} onChange={set('company')} error={f.errors.company} />
              <SelectField label="Topic" required value={v.topic} onChange={set('topic')} options={requirementOptions} error={f.errors.topic} />
            </div>
            <TextField label="Preferred date" type="date" min={today} value={v.preferredDate} onChange={set('preferredDate')} error={f.errors.preferredDate} />
            <ChoiceField legend="Preferred time" options={timeSlots} value={v.preferredTime} onChange={(x) => set('preferredTime')(x as string)} />
            <Honeypot value={v.hp} onChange={set('hp')} />
            {f.status === 'error' && <FormAlert kind="error">{f.message}</FormAlert>}
            <Button type="submit" size="lg" disabled={f.busy} className="w-full">{f.busy ? 'Sending...' : 'Request my consultation'}</Button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
