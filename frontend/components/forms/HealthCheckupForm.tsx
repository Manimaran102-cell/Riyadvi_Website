'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { api } from '@/lib/api';
import { check, hcSteps, type FieldErrors } from '@/lib/validation';
import { hc } from '@/lib/options';
import { Button } from '@/components/ui/Button';
import { FormAlert } from '@/components/ui/StatusMessage';
import { Honeypot, ChoiceField, RatingField, SelectField, TextAreaField, TextField } from './fields';
import { useFormSubmit } from './useFormSubmit';
import { useConsultation } from './ConsultationProvider';
import { cn } from '@/lib/utils';

const STEPS = ['Business', 'Digital presence', 'Marketing', 'Technology', 'Challenges', 'Submit'];
const PREFIX_TO_STEP: Record<string, number> = { business: 0, digital: 1, marketing: 2, technology: 3, challenges: 4, consent: 5 };

const empty = {
  companyName: '', contactName: '', email: '', phone: '', industry: '', companySize: '', website: '',
  hasWebsite: '', websiteRating: 0, mobileFriendly: '', presence: [] as string[],
  channels: [] as string[], monthlyBudget: '', tracksLeads: '',
  currentStack: '', needs: [] as string[], usesCrm: '',
  primary: [] as string[], timeline: '', projectBudget: '', notes: '',
  consent: false, hp: '',
};
type Data = typeof empty;
interface Result { id: string; score: number; level: string; insights: string[] }

export function HealthCheckupForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const f = useFormSubmit<Result>();
  const { open } = useConsultation();
  const set = <K extends keyof Data>(k: K) => (val: Data[K]) => { setD((p) => ({ ...p, [k]: val })); setErrors((e) => ({ ...e, [k]: '' })); };
  const err = (k: string) => errors[k] || f.errors[k];

  function next() {
    const r = check(hcSteps[step], d);
    if (!r.ok) { setErrors(r.errors); setTimeout(() => (document.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 30); return; }
    setErrors({}); setStep((s) => s + 1);
    document.getElementById('checkup-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!d.consent) { setErrors({ consent: 'Please agree so we can contact you' }); return; }
    const payload = {
      business: { companyName: d.companyName, contactName: d.contactName, email: d.email, phone: d.phone, industry: d.industry, companySize: d.companySize, website: d.website || undefined },
      digital: { hasWebsite: d.hasWebsite, websiteRating: d.websiteRating, mobileFriendly: d.mobileFriendly, presence: d.presence },
      marketing: { channels: d.channels, monthlyBudget: d.monthlyBudget, tracksLeads: d.tracksLeads },
      technology: { currentStack: d.currentStack, needs: d.needs, usesCrm: d.usesCrm },
      challenges: { primary: d.primary, timeline: d.timeline, projectBudget: d.projectBudget, notes: d.notes || undefined },
      consent: d.consent, hp: d.hp,
    };
    await f.run(() => api.healthCheckup(payload));
  }

  // If the server rejects a field, jump back to the step that owns it.
  const serverKeys = Object.keys(f.errors);
  const flat: FieldErrors = {};
  for (const k of serverKeys) flat[k.split('.').pop() as string] = f.errors[k];
  const errAt = (k: string) => errors[k] || flat[k];
  const owningStep = serverKeys.length ? PREFIX_TO_STEP[serverKeys[0].split('.')[0]] : undefined;
  useEffect(() => { if (f.status === 'error' && owningStep !== undefined) setStep(owningStep); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.status]);

  if (f.status === 'success' && f.result) return <Result r={f.result} name={d.contactName} onBook={() => open('other')} />;

  return (
    <div id="checkup-top" className="scroll-mt-28">
      <ol className="mb-8 grid grid-cols-6 gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined}>
            <div className={cn('h-1 rounded-full transition-colors', i <= step ? 'bg-gold' : 'bg-line')} />
            <span className={cn('mt-2 hidden text-sm md:block', i === step ? 'text-bone' : 'text-dim')}>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mb-6 text-sm text-muted md:hidden">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      <form onSubmit={submit} noValidate className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className="space-y-6">
            {step === 0 && (<>
              <h2 className="text-display-md">Tell us about your business</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Company name" required value={d.companyName} onChange={set('companyName')} error={errAt('companyName')} autoComplete="organization" />
                <TextField label="Your name" required value={d.contactName} onChange={set('contactName')} error={errAt('contactName')} autoComplete="name" />
                <TextField label="Email" type="email" required value={d.email} onChange={set('email')} error={errAt('email')} autoComplete="email" />
                <TextField label="Phone" type="tel" required value={d.phone} onChange={set('phone')} error={errAt('phone')} autoComplete="tel" />
                <SelectField label="Industry" required value={d.industry} onChange={set('industry')} options={hc.industry} error={errAt('industry')} />
                <SelectField label="Company size" required value={d.companySize} onChange={set('companySize')} options={hc.size} error={errAt('companySize')} />
              </div>
              <TextField label="Website" type="url" value={d.website} onChange={set('website')} error={errAt('website')} placeholder="https://" hint="Optional. We will look at it before we talk." />
            </>)}
            {step === 1 && (<>
              <h2 className="text-display-md">How is your website and online presence today?</h2>
              <ChoiceField legend="Do you have a website?" options={hc.hasWebsite} value={d.hasWebsite} onChange={(x) => set('hasWebsite')(x as string)} error={errAt('hasWebsite')} />
              <RatingField legend="How well does it bring in enquiries?" labels={['Poorly', 'Very well']} value={d.websiteRating} onChange={set('websiteRating')} error={errAt('websiteRating')} />
              <ChoiceField legend="Is it comfortable to use on a phone?" options={hc.mobile} value={d.mobileFriendly} onChange={(x) => set('mobileFriendly')(x as string)} error={errAt('mobileFriendly')} />
              <ChoiceField multiple legend="Where are you present online?" hint="Select all that apply." options={hc.presence} value={d.presence} onChange={(x) => set('presence')(x as string[])} />
            </>)}
            {step === 2 && (<>
              <h2 className="text-display-md">What does your marketing look like?</h2>
              <ChoiceField multiple legend="Which channels do you use?" options={hc.channels} value={d.channels} onChange={(x) => { const a = x as string[]; set('channels')(a.includes('none') && a.length > 1 ? (d.channels.includes('none') ? a.filter((c) => c !== 'none') : ['none']) : a); }} error={errAt('channels')} />
              <SelectField label="Monthly marketing budget" required value={d.monthlyBudget} onChange={set('monthlyBudget')} options={hc.budget} error={errAt('monthlyBudget')} />
              <ChoiceField legend="Do you track where leads come from?" options={hc.tracks} value={d.tracksLeads} onChange={(x) => set('tracksLeads')(x as string)} error={errAt('tracksLeads')} />
            </>)}
            {step === 3 && (<>
              <h2 className="text-display-md">What technology do you run on?</h2>
              <SelectField label="Current website platform" required value={d.currentStack} onChange={set('currentStack')} options={hc.stack} error={errAt('currentStack')} />
              <ChoiceField multiple legend="What do you need help with?" options={hc.needs} value={d.needs} onChange={(x) => set('needs')(x as string[])} error={errAt('needs')} />
              <ChoiceField legend="Do you use a CRM to manage leads?" options={hc.crm} value={d.usesCrm} onChange={(x) => set('usesCrm')(x as string)} error={errAt('usesCrm')} />
            </>)}
            {step === 4 && (<>
              <h2 className="text-display-md">What is getting in the way?</h2>
              <ChoiceField multiple max={3} legend="Your biggest challenges" hint="Choose up to three." options={hc.challenge} value={d.primary} onChange={(x) => set('primary')(x as string[])} error={errAt('primary')} />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="When would you like to start?" required value={d.timeline} onChange={set('timeline')} options={hc.timeline} error={errAt('timeline')} />
                <SelectField label="Project budget" required value={d.projectBudget} onChange={set('projectBudget')} options={hc.projectBudget} error={errAt('projectBudget')} />
              </div>
            </>)}
            {step === 5 && (<>
              <h2 className="text-display-md">Review and submit</h2>
              <dl className="grid gap-x-8 gap-y-3 rounded-xl border border-line bg-surface p-5 text-[0.95rem] sm:grid-cols-2">
                {[['Company', d.companyName], ['Contact', `${d.contactName} \u00B7 ${d.email}`], ['Industry', hc.industry.find((o) => o.value === d.industry)?.label], ['Priorities', d.primary.map((p) => hc.challenge.find((o) => o.value === p)?.label).join(', ')]].map(([k, v]) => (
                  <div key={k as string}><dt className="text-dim">{k}</dt><dd className="text-bone">{v}</dd></div>
                ))}
              </dl>
              <TextAreaField label="Anything else we should know?" rows={4} value={d.notes} onChange={set('notes')} maxLength={1500} hint="Optional" />
              <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] text-muted">
                <input type="checkbox" checked={d.consent} onChange={(e) => set('consent')(e.target.checked)} aria-invalid={errAt('consent') ? true : undefined} className="mt-1 h-5 w-5 accent-[#D4AF37]" />
                <span>I agree that Riyadvi may contact me about my results and related services.</span>
              </label>
              {errAt('consent') && <p role="alert" className="text-sm text-danger">{errAt('consent')}</p>}
              <Honeypot value={d.hp} onChange={set('hp')} />
              {f.status === 'error' && <FormAlert kind="error">{f.message}</FormAlert>}
            </>)}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || f.busy} className={step === 0 ? 'invisible' : ''}>Back</Button>
          {step < 5 ? <Button size="lg" onClick={next}>Continue</Button> : <Button type="submit" size="lg" disabled={f.busy}>{f.busy ? 'Analysing...' : 'Get my results'}</Button>}
        </div>
      </form>
    </div>
  );
}

function Result({ r, name, onBook }: { r: Result; name: string; onBook: () => void }) {
  const R = 54, C = 2 * Math.PI * R;
  return (
    <div role="status" className="reg rounded-xl bg-surface p-8 sm:p-10">
      <h2 className="text-display-md">Thanks, {name.split(' ')[0]}. Here is your digital readiness.</h2>
      <div className="mt-8 grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div className="relative mx-auto h-40 w-40">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="64" cy="64" r={R} fill="none" stroke="#2a2a2a" strokeWidth="8" />
            <motion.circle cx="64" cy="64" r={R} fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - r.score / 100) }} transition={{ duration: 1.4, ease: 'easeOut' }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div><div className="font-display text-4xl font-bold metal-text">{r.score}</div><div className="text-sm text-muted">out of 100</div></div>
          </div>
        </div>
        <div>
          <p className="font-display text-xl font-semibold">{r.level} stage</p>
          <ul className="mt-3 space-y-2 text-muted">{r.insights.map((i) => <li key={i} className="flex gap-3"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{i}</li>)}</ul>
        </div>
      </div>
      <p className="mt-8 text-muted">Your answers are with our team. We will review them and send a tailored action plan by email.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onBook}>Book a free consultation</Button>
        <Button href="/software-project-planning-guide" variant="secondary">Get the planning guide</Button>
      </div>
    </div>
  );
}
