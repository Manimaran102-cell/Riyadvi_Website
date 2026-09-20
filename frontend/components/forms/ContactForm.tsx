'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { check, contactSchema } from '@/lib/validation';
import { requirementOptions } from '@/lib/options';
import { site, whatsappLink } from '@/lib/site';
import { Button } from '@/components/ui/Button';
import { FormAlert } from '@/components/ui/StatusMessage';
import { Honeypot, SelectField, TextAreaField, TextField } from './fields';
import { useFormSubmit } from './useFormSubmit';

export function ContactForm() {
  const params = useSearchParams();
  const preset = params.get('service') ?? '';
  const initial = requirementOptions.some((o) => o.value === preset) ? preset : '';
  const [v, setV] = useState({ name: '', email: '', phone: '', company: '', requirement: initial, message: params.get('intent') === 'quote' ? 'I would like a quote for this service. ' : '', hp: '' });
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const f = useFormSubmit();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = check(contactSchema, v);
    if (!r.ok) return f.fail(r.errors);
    await f.run(() => api.contact({ ...r.data, hp: v.hp }));
  }

  if (f.status === 'success') {
    return (
      <div className="reg rounded-xl bg-surface p-8 sm:p-10" role="status">
        <h2 className="text-display-md">Thanks, {v.name.split(' ')[0]}. We have your message.</h2>
        <p className="mt-3 max-w-[52ch] text-muted">A member of the Riyadvi team will reply within one business day. If it is urgent, message us directly.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={whatsappLink(`Hi Riyadvi, I just sent an enquiry about ${v.requirement || 'a project'}.`)} external>Continue on WhatsApp</Button>
          {site.calendly && <Button href={site.calendly} external variant="secondary">Pick a time on Calendly</Button>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" value={v.name} onChange={set('name')} error={f.errors.name} />
        <TextField label="Email" type="email" required autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={f.errors.email} />
        <TextField label="Phone" type="tel" required autoComplete="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={f.errors.phone} hint="Include country code for international numbers" />
        <TextField label="Company" autoComplete="organization" value={v.company} onChange={set('company')} error={f.errors.company} />
      </div>
      <SelectField label="What do you need?" required value={v.requirement} onChange={set('requirement')} options={requirementOptions} error={f.errors.requirement} />
      <TextAreaField label="Tell us about your project" required value={v.message} onChange={set('message')} error={f.errors.message} maxLength={2000} placeholder="Goals, timeline, and anything we should know." />
      <Honeypot value={v.hp} onChange={set('hp')} />
      {f.status === 'error' && <FormAlert kind="error">{f.message}</FormAlert>}
      <Button type="submit" size="lg" disabled={f.busy} className="w-full sm:w-auto">{f.busy ? 'Sending...' : 'Send message'}</Button>
    </form>
  );
}
