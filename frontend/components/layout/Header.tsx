'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { nav } from '@/lib/site';
import { services } from '@/data/services';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useConsultation } from '@/components/forms/ConsultationProvider';
import { smooth } from '@/components/animation/SmoothScroll';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { open: openConsultation } = useConsultation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (menu) smooth.lenis?.stop(); else smooth.lenis?.start();
    document.body.style.overflow = menu ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); menuBtn.current?.focus(); } };
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; smooth.lenis?.start(); };
  }, [menu]);

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled || menu ? 'glass border-x-0 border-t-0' : 'border-b border-transparent')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <div className="mx-auto flex h-[4.5rem] w-full max-w-shell items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Riyadvi home"><Logo /></Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.label === 'Services' ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className={cn('relative rounded-full px-4 py-2 text-[0.95rem] text-muted transition-colors hover:text-bone', active(item.href) && 'text-bone')}>
                  {item.label}
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="glass reg rounded-xl p-2">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="block rounded-lg px-4 py-2.5 hover:bg-gold/10">
                          <span className="block text-[0.95rem] font-medium text-bone">{s.name}</span>
                          <span className="block text-sm text-dim">{s.tagline}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={cn('relative rounded-full px-4 py-2 text-[0.95rem] text-muted transition-colors hover:text-bone', active(item.href) && 'text-bone')}>
                {item.label}
                {active(item.href) && <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-px bg-gold" />}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button className="hidden sm:inline-flex" onClick={() => openConsultation()}>Book a Free Consultation</Button>
          <button ref={menuBtn} type="button" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu((m) => !m)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/30 lg:hidden">
            <span className={cn('absolute h-px w-5 bg-bone transition-transform', menu ? 'rotate-45' : '-translate-y-1.5')} />
            <span className={cn('absolute h-px w-5 bg-bone transition-opacity', menu && 'opacity-0')} />
            <span className={cn('absolute h-px w-5 bg-bone transition-transform', menu ? '-rotate-45' : 'translate-y-1.5')} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div id="mobile-nav" data-lenis-prevent initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-black px-5 pb-10 pt-6 lg:hidden">
            <nav aria-label="Mobile" className="mx-auto max-w-shell">
              <ul className="divide-y divide-line">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={cn('flex min-h-14 items-center font-display text-2xl font-semibold', active(item.href) ? 'text-gold' : 'text-bone')}>{item.label}</Link>
                    {item.label === 'Services' && (
                      <ul className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1 pl-1">
                        {services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="block py-2 text-[0.95rem] text-muted hover:text-gold">{s.name}</Link></li>)}
                      </ul>
                    )}
                  </li>
                ))}
                <li><Link href="/business-health-checkup" className="flex min-h-14 items-center font-display text-2xl font-semibold text-bone">Health Checkup</Link></li>
              </ul>
              <Button size="lg" className="mt-8 w-full" onClick={() => { setMenu(false); openConsultation(); }}>Book a Free Consultation</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
