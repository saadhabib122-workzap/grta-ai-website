'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button, buttonClass } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { COMPETENCY_INFO, type Competency } from '@/lib/lab/competencies';
import { localBrief } from '@/lib/lab/brief';
import type { Brief } from '@/lib/lab/schemas';
import { useLabCall } from './useLabCall';
import { EmptyOutput, EngineBadge, Notice, Panel, Rise, Skeleton } from './LabShell';
import { cn } from '@/lib/cn';

export const BRIEF_STORAGE_KEY = 'grta-lab-brief';

export function BriefDemo({ initialText, examples, compact = false }: {
  initialText?: string;
  examples?: string[];
  compact?: boolean;
}) {
  const t = useTranslations('lab.brief');
  const te = useTranslations('lab.errors');
  const [text, setText] = useState(initialText ?? '');
  const [added, setAdded] = useState<Competency[]>([]);
  const { state, run } = useLabCall<Brief>('/api/lab/brief', localBrief);

  // Keep the latest brief so the Team tab can build a team for it
  useEffect(() => {
    if (state.status === 'done') {
      try { sessionStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(state.data)); } catch { /* storage blocked */ }
    }
  }, [state]);

  return (
    <div className={cn('grid gap-5', compact ? 'lg:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-[1fr_1.2fr]')}>
      <Panel className="lg:self-start">
        <form onSubmit={(e) => { e.preventDefault(); setAdded([]); run(text); }} className="flex h-full flex-col gap-4">
          <label htmlFor="brief-input" className="text-sm font-medium">{t('inputLabel')}</label>
          <textarea
            id="brief-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={compact ? 6 : 8}
            maxLength={2000}
            className="input min-h-40 resize-y text-[1.02rem] leading-relaxed"
          />
          {examples && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="t-label mr-1">{t('examples')}</span>
              {examples.map((ex, i) => (
                <button key={i} type="button" onClick={() => setText(ex)}
                  className="rounded-full border border-line bg-bg px-3 py-1.5 text-left text-sm text-muted hover:border-brand hover:text-fg">
                  {ex.split(' ').slice(0, 5).join(' ')}…
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" arrow disabled={state.status === 'loading'}>{t('submit')}</Button>
            {state.status === 'error' && <Notice tone="accent">{te('tooShort')}</Notice>}
          </div>
        </form>
      </Panel>

      <Panel className="bg-bg">
        <div aria-live="polite">
          {state.status === 'idle' || state.status === 'error' ? (
            <EmptyOutput text={t('empty')} icon="brief" />
          ) : state.status === 'loading' ? (
            <Skeleton label={t('working')} lines={8} />
          ) : (
            <BriefResult brief={state.data} engine={state.engine} added={added} onAdd={(c) => setAdded((a) => [...a, c])} limited={state.limited} />
          )}
        </div>
      </Panel>
    </div>
  );
}

function BriefResult({ brief, engine, added, onAdd, limited }: {
  brief: Brief;
  engine: 'ai' | 'local';
  added: Competency[];
  onAdd: (c: Competency) => void;
  limited?: boolean;
}) {
  const t = useTranslations('lab.brief');
  const te = useTranslations('lab.errors');
  const comps = [...brief.competencies, ...added.filter((c) => !brief.competencies.includes(c))];

  return (
    <div className="grid gap-6">
      <Rise className="flex items-center justify-between gap-3">
        <h3 className="t-h3">{t('outTitle')}</h3>
        <EngineBadge engine={engine} />
      </Rise>

      <Rise i={1} className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="t-label mb-1.5">{t('goal')}</p>
          <p className="font-display text-lg font-semibold leading-snug">{brief.goal}</p>
        </div>
        {brief.timeline && (
          <div className="sm:text-right">
            <p className="t-label mb-1.5">{t('timeline')}</p>
            <p className="font-mono text-sm">{brief.timeline}</p>
          </div>
        )}
      </Rise>

      <Rise i={2}>
        <p className="t-label mb-2">{t('roles')}</p>
        <ul className="grid gap-2">
          {brief.roles.map((r) => (
            <li key={r.title} className="flex gap-3 rounded-md border border-line bg-surface px-3.5 py-2.5">
              <Icon name="customers" size={18} className="mt-0.5 text-muted" accent={false} />
              <span><span className="font-semibold">{r.title}</span> <span className="text-muted">· {r.why}</span></span>
            </li>
          ))}
        </ul>
      </Rise>

      <Rise i={3}>
        <p className="t-label mb-2">{t('competencies')}</p>
        <div className="flex flex-wrap gap-2">
          {comps.map((c) => (
            <span key={c} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm',
              added.includes(c) ? 'border-accent/40 bg-accent/10' : 'border-line bg-surface')}>
              <Icon name={COMPETENCY_INFO[c].icon} size={16} />
              {COMPETENCY_INFO[c].name}
            </span>
          ))}
        </div>
      </Rise>

      {brief.gaps.length > 0 && (
        <Rise i={4} className="rounded-lg border border-accent/30 bg-accent/[0.06] p-4">
          <p className="mb-3 flex items-center gap-2 font-display font-semibold">
            <Icon name="gap" size={20} /> {t('gapTitle')}
          </p>
          <ul className="grid gap-3">
            {brief.gaps.map((g) => {
              const done = added.includes(g.competency);
              return (
                <li key={g.competency} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-[0.95rem]">{g.message}</p>
                  <button
                    type="button"
                    disabled={done}
                    onClick={() => onAdd(g.competency)}
                    className={cn(buttonClass({ variant: done ? 'ghost' : 'secondary' }), 'h-9 shrink-0 px-4 text-sm')}
                  >
                    {done ? <><Icon name="check" size={16} accent={false} /> {t('added')}</> : <>{t('gapCta')}: {COMPETENCY_INFO[g.competency].name}</>}
                  </button>
                </li>
              );
            })}
          </ul>
        </Rise>
      )}
      {brief.gaps.length === 0 && <Rise i={4}><Notice>{t('noGaps')}</Notice></Rise>}

      <Rise i={5} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <Link href="/lab#team" className={buttonClass({ variant: 'ghost' })}>
          {t('toTeam')} <Icon name="arrow-right" size={18} accent={false} />
        </Link>
        {limited && <Notice>{te('rateLimited')}</Notice>}
      </Rise>
    </div>
  );
}
