'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

/** Shared bits for the Lab demos: engine badge, empty state, skeleton, notices. */

export function EngineBadge({ engine }: { engine: 'ai' | 'local' }) {
  const t = useTranslations('lab');
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider',
      engine === 'ai' ? 'bg-brand/10 text-brand' : 'bg-sunk text-muted')}>
      <span className={cn('h-1.5 w-1.5 rounded-full', engine === 'ai' ? 'bg-accent' : 'bg-thread')} />
      {engine === 'ai' ? t('engineLive') : t('engineLocal')}
    </span>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('card relative overflow-hidden p-5 sm:p-7', className)}>{children}</div>;
}

export function EmptyOutput({ text, icon = 'spark' }: { text: string; icon?: string }) {
  return (
    <div className="grid h-full min-h-56 place-items-center rounded-lg border border-dashed border-line p-8 text-center text-muted">
      <div className="flex flex-col items-center gap-3">
        <Icon name={icon} size={28} />
        <p className="max-w-xs text-sm">{text}</p>
      </div>
    </div>
  );
}

export function Skeleton({ lines = 6, label }: { lines?: number; label: string }) {
  return (
    <div role="status" aria-live="polite" className="grid gap-3">
      <p className="t-label flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> {label}
      </p>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded-md bg-[linear-gradient(90deg,var(--surface-sunk),color-mix(in_oklab,var(--thread)_25%,var(--surface-sunk)),var(--surface-sunk))] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]"
          style={{ width: `${55 + ((i * 37) % 45)}%` }}
        />
      ))}
    </div>
  );
}

export function Notice({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'accent' }) {
  return <p className={cn('text-sm', tone === 'accent' ? 'text-accent-fg' : 'text-muted')}>{children}</p>;
}

/** Fade-and-rise entrance for result blocks, staggered by index. */
export function Rise({ i = 0, children, className }: { i?: number; children: ReactNode; className?: string }) {
  return (
    <div className={cn('animate-[rise_.5s_var(--ease)_both]', className)} style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  );
}
