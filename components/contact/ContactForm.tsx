'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

type Mode = 'demo' | 'waitlist' | 'partner';
type Status = 'idle' | 'sending' | 'done' | 'error';

const SIZES = ['1-50', '51-200', '201-1000', '1000+'];
const ROLES = ['hr', 'project', 'partner', 'other'] as const;

export function ContactForm({ mode = 'demo', source }: { mode?: Mode; source: string }) {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const errs: Record<string, string> = {};
    for (const k of ['name', 'email', 'company']) if (!data[k]?.trim()) errs[k] = t('required');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = t('invalidEmail');
    if (!data.consent) errs.consent = t('required');
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent: true, mode, source }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-on-brand">
          <Icon name="check" accent={false} />
        </span>
        <p className="t-h3">{t('thanksTitle')}</p>
        <p className="text-muted">{t('thanks')}</p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? <p id={`${k}-err`} className="text-sm text-accent-fg">{errors[k]}</p> : null;
  const aria = (k: string) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-err` } : {});

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {/* Honeypot: humans never see or fill this */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${source}-name`}>{t('name')}</label>
          <input id={`${source}-name`} name="name" autoComplete="name" className="input" {...aria('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={`${source}-email`}>{t('email')}</label>
          <input id={`${source}-email`} name="email" type="email" autoComplete="email" className="input" {...aria('email')} />
          {err('email')}
        </div>
        <div className="field">
          <label htmlFor={`${source}-company`}>{t('company')}</label>
          <input id={`${source}-company`} name="company" autoComplete="organization" className="input" {...aria('company')} />
          {err('company')}
        </div>
        <div className="field">
          <label htmlFor={`${source}-size`}>{t('size')}</label>
          <select id={`${source}-size`} name="size" className="input" defaultValue="">
            <option value="" disabled>{t('sizePlaceholder')}</option>
            {SIZES.map((s) => <option key={s} value={s}>{s.replace('-', '–')}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="field">
        <legend className="mb-1.5 text-sm font-medium">{t('role')}</legend>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <label key={r} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={r}
                defaultChecked={mode === 'partner' ? r === 'partner' : r === 'hr'}
                className="peer sr-only"
              />
              <span className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-sm transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {t(`roles.${r}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {mode !== 'waitlist' && (
        <div className="field">
          <label htmlFor={`${source}-message`}>{t('message')}</label>
          <textarea id={`${source}-message`} name="message" rows={3} className="input resize-y" placeholder={t('messagePlaceholder')} />
        </div>
      )}

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 accent-[var(--brand)]" {...aria('consent')} />
        <span>
          {t.rich('consent', {
            link: (chunks) => (
              <Link href="/legal#privacy" className="underline underline-offset-2 hover:text-fg">{chunks}</Link>
            ),
          })}
        </span>
      </label>
      {err('consent')}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" arrow disabled={status === 'sending'}>
          {status === 'sending' ? t('sending') : t('submit')}
        </Button>
        <p className="text-sm text-muted">{t('privacyNote')}</p>
      </div>
      {status === 'error' && <p role="alert" className="text-sm text-accent-fg">{t('error')}</p>}
    </form>
  );
}
