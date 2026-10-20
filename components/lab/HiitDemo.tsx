'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { COMPETENCY_INFO } from '@/lib/lab/competencies';
import { ROOMS, localHiit, pickExperts } from '@/lib/lab/hiit';
import type { HiitPlan } from '@/lib/lab/schemas';
import { useLabCall } from './useLabCall';
import { EngineBadge, Notice, Panel, Rise } from './LabShell';
import { cn } from '@/lib/cn';

const ROOM_TINT = ['bg-fjord/20', 'bg-moss/20', 'bg-clay/30'];

export function HiitDemo() {
  const t = useTranslations('lab.hiit');
  const te = useTranslations('lab.errors');
  const [q, setQ] = useState(t('example'));
  const { state, run } = useLabCall<HiitPlan>('/api/lab/hiit', localHiit, 'question');
  const experts = useMemo(() => pickExperts(), []);
  // The plan is revealed a beat after the rooms fill in
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (state.status !== 'done') return;
    const id = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(id);
  }, [state.status]);
  // 0 idle, 1 nine, 2 three, 3 one
  const stage = state.status === 'loading' ? 1 : state.status === 'done' ? (revealed ? 3 : 2) : 0;

  const plan = state.status === 'done' ? state.data : null;
  const insight = (c: string) => plan?.perspectives.find((p) => p.competency === c)?.insight;

  return (
    <div className="grid gap-5">
      <Panel>
        <form onSubmit={(e) => { e.preventDefault(); setRevealed(false); run(q); }} className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="hiit-input" className="text-sm font-medium">{t('inputLabel')}</label>
            <input id="hiit-input" value={q} onChange={(e) => setQ(e.target.value)} maxLength={800} className="input mt-2 font-display text-lg font-semibold" />
          </div>
          <Button type="submit" arrow disabled={state.status === 'loading'}>{state.status === 'loading' ? t('working') : t('submit')}</Button>
        </form>
        {state.status === 'error' && <div className="mt-3"><Notice tone="accent">{te('tooShort')}</Notice></div>}

        {/* stage indicator */}
        <ol className="mt-6 grid grid-cols-3 gap-2 font-mono text-xs uppercase tracking-widest">
          {[t('stageNine'), t('stageThree'), t('stageOne')].map((s, i) => (
            <li key={s} className={cn('rounded-full border px-3 py-2 text-center transition-colors duration-500',
              stage > i ? 'border-brand bg-brand text-on-brand' : stage === i + 1 ? 'border-accent text-accent-fg' : 'border-line text-muted')}>
              {s}
            </li>
          ))}
        </ol>
      </Panel>

      {/* Rooms */}
      <div className="grid gap-5 md:grid-cols-3">
        {ROOMS.map((room, ri) => (
          <Panel key={room.id} className={cn('transition-opacity duration-500', stage === 0 && 'opacity-80')}>
            <p className="t-label">{t('room')} {room.id} · {room.name}</p>
            <ul className="mt-4 grid gap-3">
              {room.competencies.map((c, i) => {
                const p = experts[c];
                const text = insight(c);
                return (
                  <li key={c} className="rounded-lg border border-line bg-bg p-3" style={{ transitionDelay: `${(ri * 3 + i) * 60}ms` }}>
                    <div className="flex items-center gap-3">
                      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full', ROOM_TINT[ri])}>
                        <Icon name={COMPETENCY_INFO[c].icon} size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        <p className="truncate text-xs text-muted">{COMPETENCY_INFO[c].name}</p>
                      </div>
                    </div>
                    {text && stage >= 2 && <p className="mt-2.5 animate-[rise_.4s_var(--ease)_both] text-sm text-muted">{text}</p>}
                    {state.status === 'loading' && <div className="mt-2.5 h-3 w-4/5 rounded bg-[linear-gradient(90deg,var(--surface-sunk),color-mix(in_oklab,var(--thread)_25%,var(--surface-sunk)),var(--surface-sunk))] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />}
                  </li>
                );
              })}
            </ul>
          </Panel>
        ))}
      </div>

      {/* Plan */}
      {plan && stage >= 3 && state.status === 'done' && (
        <Panel className="print-plan border-brand/40">
          <Rise className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="t-label">{t('planTitle')}</p>
              <h3 className="t-h3 mt-2 max-w-3xl">{plan.summary}</h3>
            </div>
            <div className="flex items-center gap-2">
              <EngineBadge engine={state.engine} />
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:bg-sunk">
                <Icon name="download" size={16} accent={false} />{t('print')}
              </button>
            </div>
          </Rise>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-tag">
                <tr className="border-b border-line">
                  <th className="py-2 pr-3">#</th><th className="py-2 pr-3">{t('action')}</th><th className="py-2 pr-3">{t('owner')}</th>
                  <th className="py-2 pr-3">{t('deadline')}</th><th className="py-2">{t('kpi')}</th>
                </tr>
              </thead>
              <tbody>
                {plan.plan.map((a, i) => (
                  <tr key={i} className="animate-[rise_.4s_var(--ease)_both] border-b border-line align-top" style={{ animationDelay: `${i * 80}ms` }}>
                    <td className="py-3 pr-3 font-mono">{a.priority}</td>
                    <td className="py-3 pr-3 font-medium">{a.action}</td>
                    <td className="py-3 pr-3 whitespace-nowrap">{experts[a.competency]?.name}<span className="block text-xs text-muted">{COMPETENCY_INFO[a.competency].name}</span></td>
                    <td className="py-3 pr-3 whitespace-nowrap font-mono">{a.weeks} wk</td>
                    <td className="py-3 text-muted">{a.kpi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">{t('disclaimer')}</p>
        </Panel>
      )}
    </div>
  );
}
