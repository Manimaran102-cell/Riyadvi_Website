'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { admin } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FormAlert } from '@/components/ui/StatusMessage';
import { TextField } from '@/components/forms/fields';
import { useFormSubmit } from '@/components/forms/useFormSubmit';
import { setToken } from './session';

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const f = useFormSubmit<{ token: string }>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await f.run(() => admin.login(email, password));
    if (r) { setToken(r.token); router.push('/admin'); }
  }

  return (
    <Container className="grid min-h-[70vh] place-items-center">
      <form onSubmit={submit} className="reg w-full max-w-md space-y-5 rounded-xl bg-surface p-8" aria-label="Admin sign in">
        <h1 className="text-display-md">Admin sign in</h1>
        <TextField label="Email" type="email" required autoComplete="username" value={email} onChange={setEmail} error={f.errors.email} />
        <TextField label="Password" type="password" required autoComplete="current-password" value={password} onChange={setPassword} error={f.errors.password} />
        {f.status === 'error' && <FormAlert kind="error">{f.message}</FormAlert>}
        <Button type="submit" size="lg" className="w-full" disabled={f.busy}>{f.busy ? 'Signing in...' : 'Sign in'}</Button>
      </form>
    </Container>
  );
}
