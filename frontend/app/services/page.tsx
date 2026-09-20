import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Container } from '@/components/ui/Container';
import { ServiceGlyph } from '@/components/three/Fallbacks';
import { getServices } from '@/lib/content';

export const metadata: Metadata = { title: 'Services', description: 'Web development, app development, digital marketing, AR/VR, 3D modelling and UI/UX design from a single technology partner.', alternates: { canonical: '/services' } };

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero title="Everything you need to grow digitally" lead="Six connected services, one accountable team. Start with one, add others as you grow." crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      <Container className="pb-20">
        <ul className="divide-y divide-line border-y border-line">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group grid items-center gap-4 py-8 transition-colors hover:bg-gold/5 md:grid-cols-[6rem_1fr_1.2fr_auto] md:gap-8 md:px-4">
                <ServiceGlyph kind={s.scene} className="h-16 w-16 transition-transform duration-300 group-hover:scale-110" />
                <h2 className="font-display text-2xl font-semibold md:text-3xl">{s.name}</h2>
                <p className="max-w-[52ch] text-muted">{s.summary}</p>
                <span className="text-gold group-hover:underline">Learn more</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
