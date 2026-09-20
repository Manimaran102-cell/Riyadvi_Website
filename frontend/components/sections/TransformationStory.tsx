'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/ui/Container';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { title: 'Business challenge', body: 'We start with the problem, not the technology: where growth is stuck, who you serve and what success would look like in numbers.', out: 'Goals, audit and success metrics' },
  { title: 'Strategy', body: 'A clear plan for what to build first, what to leave out and how each decision connects to revenue, retention or cost.', out: 'Roadmap, scope and priorities' },
  { title: 'Design', body: 'Journeys and interfaces shaped around real users, tested early so the build never depends on guesswork.', out: 'Prototypes and a design system' },
  { title: 'Technology', body: 'Modern, maintainable engineering with performance, security and integration built in from the first commit.', out: 'Working software, weekly demos' },
  { title: 'Launch', body: 'Rigorous testing, a monitored release and a team on hand so go-live day is uneventful.', out: 'Production release and monitoring' },
  { title: 'Growth', body: 'Analytics, marketing and continuous improvement that turn a launch into compounding results.', out: 'Data-led iteration and reporting' },
];

/**
 * Scroll-driven storytelling. On desktop the section is pinned and a GSAP timeline (scrubbed by ScrollTrigger)
 * advances the active stage; on phones and for reduced-motion users it renders as a simple vertical list.
 */
export function TransformationStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', el);
      const nodes = gsap.utils.toArray<HTMLElement>('[data-node]', el);
      const prog = el.querySelector('[data-progress]');
      const n = stages.length;
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });
      gsap.set(prog, { scaleY: 0, transformOrigin: 'top center' });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el.querySelector('[data-pin]'), start: 'top top', end: `+=${n * 85}%`, pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      nodes.forEach((node, i) => {
        if (i > 0) {
          const at = i - 0.4;
          tl.to(panels[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 }, at)
            .fromTo(panels[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.05)
            .to(prog, { scaleY: i / (n - 1), duration: 1 }, i - 1);
        }
        tl.to(node, { backgroundColor: '#D4AF37', color: '#000000', scale: 1.15, duration: 0.3 }, Math.max(0, i - 0.4));
      });
      tl.to({}, { duration: 0.6 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="story-title" className="relative border-y border-line">
      <div data-pin className="relative flex min-h-screen items-center py-24 md:py-0">
        <Container className="grid w-full gap-12 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-20">
          <div>
            <h2 id="story-title" className="text-display-lg">From business challenge to lasting growth</h2>
            <div className="relative mt-10 space-y-10 md:mt-12 md:h-[15rem] md:space-y-0">
              {stages.map((s, i) => (
                <article key={s.title} data-panel className="md:absolute md:inset-0">
                  <h3 className="font-display text-2xl font-semibold text-gold md:text-3xl"><span className="mr-3 text-bone/40">{i + 1}</span>{s.title}</h3>
                  <p className="mt-3 max-w-[50ch] text-lg text-muted">{s.body}</p>
                  <p className="mt-4 text-[0.95rem] text-bone"><span className="text-dim">You get: </span>{s.out}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative hidden h-[26rem] md:block" aria-hidden>
            <div className="absolute bottom-4 left-5 top-4 w-px bg-line" />
            <div data-progress className="absolute bottom-4 left-5 top-4 w-px bg-gold shadow-[0_0_12px_2px_rgba(212,175,55,0.6)]" />
            <ol className="relative flex h-full flex-col justify-between">
              {stages.map((s, i) => (
                <li key={s.title} className="flex items-center gap-6">
                  <span data-node className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-black font-display text-sm font-semibold text-gold">{i + 1}</span>
                  <span className="font-display text-lg text-bone/80">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  );
}
