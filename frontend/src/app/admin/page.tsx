'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, KeyRound, Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, Field, Input } from '@/components/ui/primitives';
import { API_BASE_URL } from '@/config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vortex_admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide all credentials.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('vortex_admin_token', data.token);
        localStorage.setItem('vortex_admin_user', JSON.stringify(data.admin));
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to API server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen select-none flex-col justify-between bg-canvas p-6">
      <div className="mx-auto w-full max-w-7xl pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Public Site
        </Link>
      </div>

      <div className="mx-auto my-auto w-full max-w-md">
        <Card padding="lg">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
              <ShieldAlert className="h-6 w-6" />
            </span>
            <h1 className="font-space text-2xl font-bold tracking-wider text-ink">
              Pinaki Control Panel
            </h1>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
              Secure Authorization Gateway
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Field
              label={
                <>
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  Security Email
                </>
              }
            >
              {(id) => (
                <Input
                  id={id}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agency.com"
                  autoComplete="username"
                  required
                />
              )}
            </Field>

            <Field
              label={
                <>
                  <KeyRound className="h-3.5 w-3.5 text-accent" />
                  Encrypted Password
                </>
              }
            >
              {(id) => (
                <Input
                  id={id}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              )}
            </Field>

            <div aria-live="polite">
              {error && (
                <p className="rounded-lg border border-negative-line bg-negative-soft p-3 font-poppins text-xs text-negative">
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" fullWidth disabled={loading} className="mt-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Decrypting session…
                </>
              ) : (
                'Enter Terminal'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center font-mono text-[10px] text-ink-subtle">
            Default dev user: admin@agency.com / admin123
          </p>
        </Card>
      </div>

      <div className="mx-auto w-full max-w-7xl pb-4 text-center font-mono text-[10px] text-ink-subtle">
        Pinaki Control Panel — all connections encrypted over SSL-JWT
      </div>
    </div>
  );
}
