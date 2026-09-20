'use client';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { useConsultation } from '@/components/forms/ConsultationProvider';

export function ConsultButton({ children = 'Book a Free Consultation', topic, variant, size, className }: { children?: ReactNode; topic?: string; variant?: 'primary' | 'secondary' | 'ghost'; size?: 'md' | 'lg'; className?: string }) {
  const { open } = useConsultation();
  return <Button variant={variant} size={size} className={className} onClick={() => open(topic)}>{children}</Button>;
}
