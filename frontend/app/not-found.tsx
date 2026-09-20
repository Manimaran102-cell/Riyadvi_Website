import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <p className="font-display text-7xl font-bold metal-text">404</p>
        <h1 className="mt-4 text-display-md">This page could not be found</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The link may be out of date or the page may have moved. Try the homepage or one of our services.</p>
        <div className="mt-8 flex justify-center gap-3"><Button href="/">Back to home</Button><Button href="/services" variant="secondary">Our services</Button></div>
      </div>
    </Container>
  );
}
