'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Milestone } from '@/types';

gsap.registerPlugin(ScrollTrigger);

/**
 * Company timeline. Desktop: the section pins and scroll drives a horizontal track (GSAP + ScrollTrigger),
 * with a gold progress line. Mobile / reduced motion: a plain vertical list.
 */
export function AboutTimeline({ milestones }: { milestones: Milestone[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = el.querySelector<HTMLElement>('[data-track]')!;
      const bar = el.querySelector<HTMLElement>('[data-bar]')!;
      const dist = () => Math.max(0, track.scrollWidth - el.clientWidth + 96);
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist() + 200}`, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 } });
      tl.to(track, { x: () => -dist() }, 0).to(bar, { scaleX: 1 }, 0);
      gsap.utils.toArray<HTMLElement>('[data-item]', el).forEach((item) => {
        gsap.fromTo(item, { opacity: 0.3 }, { opacity: 1, scrollTrigger: { trigger: item, containerAnimation: tl, start: 'left 80%', end: 'left 45%', scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative overflow-hidden md:flex md:h-screen md:items-center">
      <div className="mx-auto w-full max-w-shell px-5 py-20 sm:px-8 md:max-w-none md:py-0 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <h2 className="text-display-lg">Milestones on the way</h2>
        <div className="relative mt-12 md:mt-16">
          <div className="absolute left-0 top-3 hidden h-px w-[200vw] bg-line md:block" />
          <div data-bar className="absolute left-0 top-3 hidden h-px w-[200vw] bg-gold md:block" />
          <ol data-track className="relative flex flex-col gap-10 md:w-max md:flex-row md:gap-16 md:pr-24">
            {milestones.map((m) => (
              <li key={m.year} data-item className="relative pl-8 md:w-[22rem] md:pl-0 md:pt-10">
                <span className="absolute left-0 top-2 h-3 w-3 rotate-45 bg-gold md:top-1.5" aria-hidden />
                <p className="font-display text-4xl font-bold metal-text">{m.year}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{m.title}</h3>
                <p className="mt-2 max-w-[42ch] text-muted">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
