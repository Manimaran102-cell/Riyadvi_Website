'use client';
import type { ReactNode } from 'react';
import { ConsultationProvider } from '@/components/forms/ConsultationProvider';
import { SmoothScroll } from '@/components/animation/SmoothScroll';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConsultationProvider>
      <SmoothScroll />
      {children}
    </ConsultationProvider>
  );
}
