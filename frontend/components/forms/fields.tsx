'use client';
import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { Opt } from '@/lib/options';

const control = 'w-full rounded-lg border bg-surface px-4 py-3 text-bone placeholder:text-dim transition-colors focus:border-gold focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-gold/40';

function Wrap({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-medium text-bone">
        {label}{required && <span className="text-gold" aria-hidden> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-dim">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}

const aria = (id: string, error?: string, hint?: string) => ({ 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined });

type TextProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & { label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string };
export function TextField({ label, value, onChange, error, hint, required, className, ...rest }: TextProps) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} required={required}>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cn(control, error ? 'border-danger' : 'border-line', className)} {...aria(id, error, hint)} {...rest} />
    </Wrap>
  );
}

export function TextAreaField({ label, value, onChange, error, hint, required, rows = 5, placeholder, maxLength }: { label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; required?: boolean; rows?: number; placeholder?: string; maxLength?: number }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} required={required}>
      <textarea id={id} rows={rows} value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} required={required} className={cn(control, 'resize-y', error ? 'border-danger' : 'border-line')} {...aria(id, error, hint)} />
    </Wrap>
  );
}

export function SelectField({ label, value, onChange, options, error, hint, required, placeholder = 'Select an option' }: { label: string; value: string; onChange: (v: string) => void; options: Opt[]; error?: string; hint?: string; required?: boolean; placeholder?: string }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} required={required}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cn(control, 'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10', error ? 'border-danger' : 'border-line')}
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23D4AF37' stroke-width='1.6'><path d='m3 6 5 5 5-5'/></svg>\")" }} {...aria(id, error, hint)}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Wrap>
  );
}

/** Chip-style radio (single) or checkbox (multiple) group with proper fieldset semantics. */
export function ChoiceField({ legend, options, value, onChange, multiple, error, hint, max }: { legend: string; options: Opt[]; value: string | string[]; onChange: (v: string | string[]) => void; multiple?: boolean; error?: string; hint?: string; max?: number }) {
  const id = useId();
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (v: string) => {
    if (!multiple) return onChange(v);
    if (selected.includes(v)) return onChange(selected.filter((x) => x !== v));
    if (max && selected.length >= max) return;
    onChange([...selected, v]);
  };
  return (
    <fieldset aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="mb-2 text-[0.95rem] font-medium text-bone">{legend}</legend>
      {hint && <p className="mb-2 -mt-1 text-sm text-dim">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <label key={o.value} className={cn('cursor-pointer select-none rounded-full border px-4 py-2 text-[0.95rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold', on ? 'border-gold bg-gold text-black' : 'border-line text-muted hover:border-gold/60 hover:text-bone')}>
              <input type={multiple ? 'checkbox' : 'radio'} name={id} className="sr-only" checked={on} onChange={() => toggle(o.value)} />
              {o.label}
            </label>
          );
        })}
      </div>
      {error && <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-danger">{error}</p>}
    </fieldset>
  );
}

export function RatingField({ legend, value, onChange, error, labels }: { legend: string; value: number; onChange: (v: number) => void; error?: string; labels: [string, string] }) {
  const id = useId();
  return (
    <fieldset aria-invalid={error ? true : undefined}>
      <legend className="mb-2 text-[0.95rem] font-medium text-bone">{legend}</legend>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-dim sm:block">{labels[0]}</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={cn('grid h-11 w-11 cursor-pointer place-items-center rounded-full border font-display font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold', value === n ? 'border-gold bg-gold text-black' : 'border-line text-muted hover:border-gold/60')}>
            <input type="radio" name={id} className="sr-only" checked={value === n} onChange={() => onChange(n)} />{n}
          </label>
        ))}
        <span className="hidden text-sm text-dim sm:block">{labels[1]}</span>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
    </fieldset>
  );
}

/** Hidden bot trap. Real users never see or fill it; the API silently drops submissions that do. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} /></label>
    </div>
  );
}
