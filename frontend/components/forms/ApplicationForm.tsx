'use client';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { applicationSchema, check } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { FormAlert } from '@/components/ui/StatusMessage';
import { Honeypot, TextAreaField, TextField } from './fields';
import { useFormSubmit } from './useFormSubmit';

const MAX = 5 * 1024 * 1024;
const EXT = /\.(pdf|docx?)$/i;

export function ApplicationForm({ position, jobSlug }: { position: string; jobSlug: string }) {
  const [v, setV] = useState({ name: '', email: '', phone: '', position, message: '', hp: '' });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const f = useFormSubmit();

  function pick(files: FileList | null) {
    const picked = files?.[0] ?? null;
    setFileError('');
    if (picked && !EXT.test(picked.name)) { setFile(null); return setFileError('Upload a PDF, DOC or DOCX file.'); }
    if (picked && picked.size > MAX) { setFile(null); return setFileError('Resume must be 5 MB or smaller.'); }
    setFile(picked);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = check(applicationSchema, v);
    const errs = r.ok ? {} : r.errors;
    if (!file && !fileError) errs.resume = 'Please attach your resume.';
    if (fileError) errs.resume = fileError;
    if (Object.keys(errs).length) return f.fail(errs);
    const fd = new FormData();
    Object.entries({ name: v.name, email: v.email, phone: v.phone, position: v.position, jobSlug, message: v.message, hp: v.hp }).forEach(([k, val]) => fd.append(k, val));
    fd.append('resume', file as File);
    await f.run(() => api.application(fd));
  }

  if (f.status === 'success') {
    return (
      <div role="status" className="reg rounded-xl bg-surface p-8">
        <h3 className="text-display-md">Application received</h3>
        <p className="mt-3 text-muted">Thank you, {v.name.split(' ')[0]}. Our team will review your profile and reply by email if there is a match.</p>
      </div>
    );
  }

  const resumeErr = f.errors.resume || fileError;
  return (
    <form onSubmit={submit} noValidate className="relative space-y-5" aria-label={`Apply for ${position}`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" value={v.name} onChange={set('name')} error={f.errors.name} />
        <TextField label="Email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} error={f.errors.email} />
        <TextField label="Phone" type="tel" required autoComplete="tel" value={v.phone} onChange={set('phone')} error={f.errors.phone} />
        <TextField label="Position" required value={v.position} onChange={set('position')} error={f.errors.position} />
      </div>
      <div>
        <label htmlFor="resume" className="mb-1.5 block text-[0.95rem] font-medium">Resume <span className="text-gold" aria-hidden>*</span></label>
        <input ref={input} id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => pick(e.target.files)} aria-invalid={resumeErr ? true : undefined}
          className="block w-full cursor-pointer rounded-lg border border-dashed border-gold/40 bg-surface p-3 text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-black hover:border-gold" />
        <p className="mt-1.5 text-sm text-dim">{file ? `${file.name} (${Math.round(file.size / 1024)} KB)` : 'PDF, DOC or DOCX, up to 5 MB'}</p>
        {resumeErr && <p role="alert" className="mt-1 text-sm text-danger">{resumeErr}</p>}
      </div>
      <TextAreaField label="Message" rows={4} value={v.message} onChange={set('message')} error={f.errors.message} maxLength={2000} hint="Optional. Links to your work are welcome." />
      <Honeypot value={v.hp} onChange={set('hp')} />
      {f.status === 'error' && <FormAlert kind="error">{f.message}</FormAlert>}
      <Button type="submit" size="lg" disabled={f.busy} className="w-full sm:w-auto">{f.busy ? 'Submitting...' : 'Submit application'}</Button>
    </form>
  );
}
