'use client';
import { useCallback, useState } from 'react';
import { ApiError } from '@/lib/api';
import type { FieldErrors } from '@/lib/validation';

export type Status = 'idle' | 'submitting' | 'success' | 'error';

/** Shared submit lifecycle: loading, server field errors, generic error banner and success state. */
export function useFormSubmit<T = unknown>() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<T | null>(null);

  const focusFirstError = () => setTimeout(() => (document.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 30);

  const fail = useCallback((errs: FieldErrors) => { setErrors(errs); setStatus('idle'); setMessage(''); focusFirstError(); }, []);

  const run = useCallback(async (fn: () => Promise<T>) => {
    setStatus('submitting'); setMessage(''); setErrors({});
    try {
      const data = await fn();
      setResult(data); setStatus('success');
      return data;
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError(0, 'Something went wrong. Please try again.');
      setErrors(err.fields ?? {}); setMessage(err.message); setStatus('error');
      if (err.fields && Object.keys(err.fields).length) focusFirstError();
      return undefined;
    }
  }, []);

  const reset = useCallback(() => { setStatus('idle'); setMessage(''); setErrors({}); setResult(null); }, []);
  return { status, message, errors, result, run, fail, reset, busy: status === 'submitting' };
}
