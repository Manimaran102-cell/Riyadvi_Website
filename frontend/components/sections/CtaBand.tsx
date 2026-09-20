import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ConsultButton } from '@/components/ui/ConsultButton';

export function CtaBand({ title = 'Ready to build what comes next?', text = 'Tell us where you want your business to go. We will come back with a clear plan, honest timelines and a fixed next step.', quote }: { title?: string; text?: string; quote?: string }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="reg relative overflow-hidden rounded-2xl border border-gold/20 bg-surface px-6 py-14 sm:px-14 sm:py-20">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-display-lg">{title}</h2>
            <p className="mt-5 max-w-[52ch] text-lg text-muted">{text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ConsultButton size="lg" topic={quote} />
              <Button href="/business-health-checkup" variant="secondary" size="lg">Take the Health Checkup</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
