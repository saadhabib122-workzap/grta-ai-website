'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

/** Email-only sign-up for news updates. Lands in the same sheet as contact requests, with mode "news". */
export function NewsSignup() {
  const t = useTranslations('news');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')) return setError(t('invalidEmail'));
    if (!data.consent) return setError(t('required'));
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, website: data.website, consent: true, mode: 'news', source: 'news-signup' }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="rounded-[28px] bg-white p-7 shadow-soft ring-1 ring-line sm:p-10">
      <h3 className="t-h3">{t('title')}</h3>
      <p className="mt-2 text-muted">{t('text')}</p>
      {status === 'done' ? (
        <p role="status" className="mt-6 font-semibold text-brand">{t('thanks')}</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="field">
            <label htmlFor="news-email">{t('email')}</label>
            <input id="news-email" name="email" type="email" autoComplete="email" className="input" aria-invalid={error ? true : undefined} aria-describedby={error ? 'news-err' : undefined} />
          </div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
            <span>{t.rich('consent', { link: (c) => <Link href="/legal#privacy" className="underline underline-offset-2 hover:text-fg">{c}</Link> })}</span>
          </label>
          {error && <p id="news-err" className="text-sm text-accent-fg">{error}</p>}
          <Button type="submit" disabled={status === 'sending'} className="justify-self-start">
            {status === 'sending' ? t('sending') : t('submit')}
          </Button>
          {status === 'error' && <p role="alert" className="text-sm text-accent-fg">{t('error')}</p>}
        </form>
      )}
    </div>
  );
}
