import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { HealthCheckupForm } from '@/components/forms/HealthCheckupForm';

export const metadata: Metadata = { title: 'Business Health Checkup', description: 'A free six-step review of your website, marketing and technology, with a digital readiness score and clear next steps.', alternates: { canonical: '/business-health-checkup' } };

export default function HealthCheckupPage() {
  return (
    <section className="relative pb-24 pt-32 md:pt-40">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Business Health Checkup' }]} />
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <h1 className="text-display-lg">Is Your Business Ready for Its Next Digital Growth Stage?</h1>
            <p className="mt-6 max-w-[46ch] text-lg text-muted">Answer a few questions about your website, marketing and technology. You will get a readiness score straight away, and our team will follow up with a tailored action plan.</p>
            <ul className="mt-8 space-y-3 text-muted">
              {['Takes about five minutes', 'Instant digital readiness score', 'No obligation, no sales pressure'].map((t) => <li key={t} className="flex gap-3"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
            </ul>
          </div>
          <div className="reg rounded-xl bg-surface p-6 sm:p-10"><HealthCheckupForm /></div>
        </div>
      </Container>
    </section>
  );
}
