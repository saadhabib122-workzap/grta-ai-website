'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Mark } from '@/components/brand/Logo';
import { COMPETENCY_INFO } from '@/lib/lab/competencies';
import { localTranslate } from '@/lib/lab/translate';
import type { Translation } from '@/lib/lab/schemas';
import { useLabCall } from './useLabCall';
import { EmptyOutput, EngineBadge, Notice, Panel, Rise, Skeleton } from './LabShell';

export function TranslateDemo() {
  const t = useTranslations('lab.translate');
  const te = useTranslations('lab.errors');
  const examples = t.raw('examples') as string[];
  const [text, setText] = useState(examples[0]);
  const [copied, setCopied] = useState(false);
  const { state, run } = useLabCall<Translation>('/api/lab/translate', localTranslate);

  async function copy(tr: Translation) {
    const out = `“${text}”\n→ ${tr.items.map((i) => i.label).join(', ')}\n${t('card')} · grta.ai`;
    try { await navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <Panel className="lg:self-start">
        <form onSubmit={(e) => { e.preventDefault(); run(text); }} className="flex flex-col gap-4">
          <label htmlFor="translate-input" className="text-sm font-medium">{t('inputLabel')}</label>
          <textarea id="translate-input" value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={600}
            className="input resize-y font-display text-xl font-semibold leading-snug" />
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button key={ex} type="button" onClick={() => setText(ex)}
                className="rounded-full border border-line bg-bg px-3 py-1.5 text-left text-sm text-muted hover:border-brand hover:text-fg">“{ex}”</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" arrow disabled={state.status === 'loading'}>{t('submit')}</Button>
            {state.status === 'error' && <Notice tone="accent">{te('tooShort')}</Notice>}
          </div>
        </form>
      </Panel>

      <Panel className="bg-bg">
        <div aria-live="polite">
          {state.status === 'idle' || state.status === 'error' ? (
            <EmptyOutput text={t('empty')} icon="translate" />
          ) : state.status === 'loading' ? (
            <Skeleton label={t('working')} lines={5} />
          ) : (
            <div className="grid gap-5">
              <Rise className="flex items-center justify-between gap-3">
                <h3 className="t-h3">{t('outTitle')}</h3>
                <EngineBadge engine={state.engine} />
              </Rise>
              <ul className="grid gap-3">
                {state.data.items.map((it, i) => (
                  <Rise key={it.label} i={i + 1}>
                    <li className="rounded-lg border border-line bg-surface p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-display text-lg font-bold">
                          <Icon name={COMPETENCY_INFO[it.competency].icon} size={22} />{it.label}
                        </span>
                        <span className="font-mono text-xs text-tag">{Math.round(it.confidence * 100)}% {t('confidence')}</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-sunk">
                        <div className="h-full rounded-full bg-thread transition-[width] duration-700" style={{ width: `${it.confidence * 100}%` }} />
                      </div>
                      <p className="mt-2.5 text-sm text-muted"><span className="font-medium text-fg">{t('because')}:</span> {it.because}</p>
                    </li>
                  </Rise>
                ))}
              </ul>
              <Rise i={5}><Notice>{state.data.note}</Notice></Rise>

              {/* Shareable card */}
              <Rise i={6} className="relative overflow-hidden rounded-xl bg-forest p-6 text-snow">
                <div aria-hidden className="threads-bg absolute inset-0 opacity-20" />
                <div className="relative">
                  <p className="font-display text-xl font-semibold leading-snug">“{text}”</p>
                  <p className="mt-3 font-mono text-sm text-fjord">→ {state.data.items.map((i) => i.label).join(' · ')}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[#C9D3CC]"><Mark size={22} block="var(--c-ink)" /> {t('card')}</span>
                    <button type="button" onClick={() => copy(state.data)} className="rounded-full bg-snow/10 px-3 py-1.5 text-sm hover:bg-snow/20">
                      {copied ? t('copied') : t('copy')}
                    </button>
                  </div>
                </div>
              </Rise>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
