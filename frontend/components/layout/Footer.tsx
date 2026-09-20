import Link from 'next/link';
import { site, whatsappLink } from '@/lib/site';
import { services } from '@/data/services';
import { Logo } from '@/components/ui/Logo';
import { Container } from '@/components/ui/Container';

const col = 'text-[0.95rem] text-muted hover:text-gold transition-colors';

export function Footer() {
  return (
    <footer className="relative border-t border-gold/20 bg-black pb-10 pt-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-muted">A technology and digital solutions partner helping businesses grow through design, engineering and marketing. Founded in Chennai in 2021.</p>
            <address className="mt-6 space-y-1 text-[0.95rem] not-italic text-muted">
              <p>{site.address}</p>
              <p><a className="hover:text-gold" href={site.phoneHref}>{site.phone}</a></p>
              <p><a className="hover:text-gold" href={`mailto:${site.email}`}>{site.email}</a></p>
            </address>
          </div>
          <nav aria-label="Services">
            <h2 className="mb-4 font-display text-base font-semibold text-bone">Services</h2>
            <ul className="space-y-2.5">{services.map((s) => <li key={s.slug}><Link className={col} href={`/services/${s.slug}`}>{s.name}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="mb-4 font-display text-base font-semibold text-bone">Company</h2>
            <ul className="space-y-2.5">
              {[['About', '/about'], ['Portfolio', '/portfolio'], ['Blog', '/blog'], ['Careers', '/careers'], ['Contact', '/contact']].map(([l, h]) => <li key={h}><Link className={col} href={h}>{l}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Get started">
            <h2 className="mb-4 font-display text-base font-semibold text-bone">Get started</h2>
            <ul className="space-y-2.5">
              <li><Link className={col} href="/business-health-checkup">Business Health Checkup</Link></li>
              <li><Link className={col} href="/software-project-planning-guide">Project Planning Guide</Link></li>
              <li><a className={col} href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
              <li><a className={col} href={site.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 text-sm text-dim sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Riyadvi Software Technologies Private Limited. All rights reserved.</p>
          <p>Design your success.</p>
        </div>
      </Container>
    </footer>
  );
}
