import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/montserrat';
import './globals.css';
import { site } from '@/lib/site';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Riyadvi Software Technologies | Custom Software & Digital Solutions', template: '%s | Riyadvi' },
  description: 'Riyadvi is a technology and digital solutions partner: web and app development, UI/UX design, digital marketing, AR/VR and 3D modelling for growing businesses.',
  openGraph: { type: 'website', siteName: site.name, locale: 'en_IN' },
  alternates: { canonical: '/' },
};
export const viewport: Viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };

const orgJsonLd = {
  '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, foundingDate: '2021',
  email: site.email, telephone: site.phone, address: { '@type': 'PostalAddress', streetAddress: '17, Aarti Arcade, Dr Radha Krishnan Salai, Krishnapuram, Mylapore', addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', postalCode: '600004', addressCountry: 'IN' },
  sameAs: [site.social.linkedin, site.social.facebook],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
