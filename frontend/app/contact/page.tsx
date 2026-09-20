import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ConsultButton } from '@/components/ui/ConsultButton';
import { ContactForm } from '@/components/forms/ContactForm';
import { site, whatsappLink } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact', description: 'Talk to Riyadvi about your website, app, marketing or 3D project. Get a reply within one business day.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  const mapSrc = site.mapEmbed || `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;
  return (
    <>
      <PageHero title="Tell us what you want to build" lead="Share a few details and we will reply within one business day with next steps." crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <Container className="grid gap-14 pb-24 lg:grid-cols-[1.2fr_1fr]">
        <div className="reg rounded-xl bg-surface p-6 sm:p-10">
          <Suspense fallback={<p className="text-muted">Loading form...</p>}><ContactForm /></Suspense>
        </div>
        <aside className="space-y-10">
          <div>
            <h2 className="font-display text-xl font-semibold">Reach us directly</h2>
            <address className="mt-4 space-y-2 not-italic text-muted">
              <p>{site.address}</p>
              <p><a className="hover:text-gold" href={site.phoneHref}>{site.phone}</a></p>
              <p><a className="hover:text-gold" href={`mailto:${site.email}`}>{site.email}</a></p>
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={whatsappLink()} external variant="secondary">WhatsApp</Button>
              <ConsultButton>Book a Free Consultation</ConsultButton>
            </div>
          </div>
          {site.calendly && (
            <div>
              <h2 className="font-display text-xl font-semibold">Pick a time</h2>
              <iframe title="Schedule a call on Calendly" src={site.calendly} loading="lazy" className="mt-4 h-[36rem] w-full rounded-xl border border-line bg-white" />
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-semibold">Find us</h2>
            <iframe title="Map showing the Riyadvi office in Mylapore, Chennai" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mt-4 h-64 w-full rounded-xl border border-line grayscale invert-[.92] contrast-[.9]" />
          </div>
        </aside>
      </Container>
    </>
  );
}
