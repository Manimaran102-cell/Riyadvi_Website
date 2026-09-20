'use client';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { HeroScene } from '@/components/three/dynamic';
import { HeroPoster } from '@/components/three/Fallbacks';
import { Button } from '@/components/ui/Button';
import { ConsultButton } from '@/components/ui/ConsultButton';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-20" aria-hidden />
      <SceneCanvas
        label="Interactive 3D network of connected nodes around a gold core. Move your cursor to rotate it."
        className="absolute inset-0 -z-10 opacity-50 md:left-[22%] md:opacity-100"
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        globalPointer
        fallback={<HeroPoster />}
      >
        {(q) => <HeroScene q={q} />}
      </SceneCanvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black to-transparent" aria-hidden />

      <div className="mx-auto w-full max-w-shell px-5 sm:px-8">
        <div className="max-w-[44rem]">
          <h1 className="text-display-xl text-bone">
            <span className="line-mask"><span style={{ ['--d' as string]: '0.05s' }}>Custom Software &amp;</span></span>
            <span className="line-mask"><span style={{ ['--d' as string]: '0.17s' }}>Digital Solutions to</span></span>
            <span className="line-mask"><span style={{ ['--d' as string]: '0.29s' }}>Grow Your Business</span></span>
          </h1>
          <p className="fade-in-late mt-7 max-w-[52ch] text-lg text-muted md:text-xl" style={{ ['--d' as string]: '0.55s' }}>
            Web &amp; App Development, UI/UX Design, and Business Strategy &ndash; all tailored to your needs.
          </p>
          <div className="fade-in-late pointer-events-auto mt-9 flex flex-wrap gap-3" style={{ ['--d' as string]: '0.7s' }}>
            <ConsultButton size="lg" />
            <Button href="/services" variant="secondary" size="lg">Explore Our Solutions</Button>
          </div>
          <p className="fade-in-late mt-14 max-w-[54ch] text-[0.95rem] text-dim" style={{ ['--d' as string]: '0.9s' }}>
            Founded in Chennai in 2021. Over 80 projects delivered for clients in India, Australia and the GCC, and a TechBehemoths 2025 award winner.
          </p>
        </div>
      </div>
    </section>
  );
}
