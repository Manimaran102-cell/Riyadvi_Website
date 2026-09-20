'use client';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <h1 className="text-display-md">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">An unexpected error occurred while loading this page. Please try again.</p>
        <Button onClick={reset} className="mt-8">Try again</Button>
      </div>
    </Container>
  );
}
