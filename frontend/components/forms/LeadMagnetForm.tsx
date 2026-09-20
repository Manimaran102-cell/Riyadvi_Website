'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { check, leadMagnetSchema } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { FormAlert } from '@/components/ui/StatusMessage';
import { Honeypot, TextField } from './fields';
import { useFormSubmit } from './useFormSubmit';

export function LeadMagnetForm() {
  const [v, setV] = useState({ name: '', company: '', email: '', phone: '', hp: '' });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const f = useFormSubmit<{ id: string; downloadUrl: string }>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = check(leadMagnetSchema, v);
    if (!r.ok) return f.fail(r.errors);
    await f.run(() => api.leadMagnet({ ...r.data, hp: v.hp }));
  }

  if (f.status === 'success' && f.result) {
    return (
      <div role="status" className="reg rounded-xl bg-surface p-8">
        <h2 className="text-display-md">Your guide is ready</h2>
        <p className="mt-3 text-muted">Thanks, {v.name.split(' ')[0]}. Your details are saved and the download is open below. We will also follow up with a short note; unsubscribe any time.</p>
        <Button href={f.result.downloadUrl} external size="lg" className="mt-6 w-full sm:w-auto">Download the PDF</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative space-y-5" aria-label="Download the Software Project Planning Guide">
      <TextField label="Name" required autoComplete="name" value={v.name} onChange={set('name')} error={f.errors.name} />
      <TextField label="Company" required autoComplete="organization" value={v.company} onChange={set('company')} error={f.errors.company} />
      <TextField label="Work email" type="email" required autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={f.errors.email} />
      <TextField label="Phone" type="tel" required autoComplete="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={f.errors.phone} />
      <Honeypot value={v.hp} onChange={set('hp')} />
      {f.status === 'error' && <FormAlert kind="error">{f.message}</FormAlert>}
      <Button type="submit" size="lg" disabled={f.busy} className="w-full">{f.busy ? 'Preparing your guide...' : 'Download the guide'}</Button>
      <p className="text-sm text-dim">We use your details only to send the guide and follow up about your project.</p>
    </form>
  );
}
