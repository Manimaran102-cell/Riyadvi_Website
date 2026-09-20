import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function PageHero({ title, lead, crumbs, children }: { title: string; lead?: string; crumbs: { label: string; href?: string }[]; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-40">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container>
        <Breadcrumbs items={crumbs} />
        <h1 className="max-w-4xl text-display-xl">{title}</h1>
        {lead && <p className="mt-6 max-w-[58ch] text-lg text-muted md:text-xl">{lead}</p>}
        {children}
      </Container>
    </section>
  );
}
