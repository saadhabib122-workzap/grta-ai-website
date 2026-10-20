'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { COMPETENCY_INFO, type Competency } from '@/lib/lab/competencies';
import { PRESET_BRIEFS, buildTeam, busyMatches, wildcardFor, type TeamBrief, type Variant } from '@/lib/lab/team';
import type { Brief } from '@/lib/lab/schemas';
import { BRIEF_STORAGE_KEY } from './BriefDemo';
import { Panel, Rise } from './LabShell';
import { cn } from '@/lib/cn';

const VARIANTS: Variant[] = ['execution', 'challenger', 'innovation'];

/** Turn a brief written in the Zero Blank Page tab into a team brief. */
function fromStoredBrief(): TeamBrief | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(BRIEF_STORAGE_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as Brief;
    const needs = [...new Set([...b.competencies, ...b.gaps.map((g) => g.competency)])].slice(0, 7) as Competency[];
    if (needs.length < 2) return null;
    const text = `${b.goal} ${b.roles.map((r) => r.title).join(' ')}`.toLowerCase();
    return {
      id: 'mine',
      title: b.goal.length > 70 ? `${b.goal.slice(0, 67)}…` : b.goal,
      needs,
      domain: [],
      traits: ['launch', 'migration', 'data', 'germany', 'training', 'crm', 'emissions'].filter((k) => text.includes(k)),
    };
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2);
}

export function TeamDemo() {
  const t = useTranslations('lab.team');
  // Only rendered on the client (inside a Lab tab), so reading storage here is safe
  const [briefs] = useState<TeamBrief[]>(() => {
    const mine = fromStoredBrief();
    return mine ? [mine, ...PRESET_BRIEFS] : PRESET_BRIEFS;
  });
  const [briefId, setBriefId] = useState(briefs[0].id);
  const [variant, setVariant] = useState<Variant>('execution');

  const brief = briefs.find((b) => b.id === briefId) ?? briefs[0];
  const team = useMemo(() => buildTeam(brief, variant), [brief, variant]);
  const busy = useMemo(() => busyMatches(brief), [brief]);
  const wild = useMemo(() => wildcardFor(brief), [brief]);

  return (
    <div className="grid gap-5">
      <Panel>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="team-brief" className="text-sm font-medium">{t('briefLabel')}</label>
            <select id="team-brief" value={briefId} onChange={(e) => setBriefId(e.target.value)} className="input mt-2 font-display text-lg font-semibold">
              {briefs.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div role="radiogroup" aria-label="Team variant" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-bg p-1">
            {VARIANTS.map((v) => (
              <button key={v} role="radio" aria-checked={variant === v} onClick={() => setVariant(v)}
                className={cn('h-10 rounded-full px-4 text-sm font-semibold transition-colors', variant === v ? 'bg-brand text-on-brand' : 'text-muted hover:text-fg')}>
                {t(`variants.${v}.name`)}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-muted">{t(`variants.${variant}.text`)}</p>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Team */}
        <Panel>
          <ul key={`${briefId}-${variant}`} className="grid gap-3">
            {team.members.map((m, i) => (
              <Rise key={m.person.id} i={i}>
                <li className="flex gap-4 rounded-lg border border-line bg-bg p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-clay font-display text-sm font-bold text-ink">{initials(m.person.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="font-semibold">{m.person.name}</p>
                      <p className="font-mono text-xs text-tag">{t('fit')} {m.fit.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-muted">{m.person.role} · {m.person.dept}</p>
                    <p className="mt-2 text-sm"><span className="font-medium">{t('why')}:</span> <span className="text-muted">{m.reason}</span></p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.covers.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 rounded-full bg-sunk px-2 py-0.5 text-xs">
                          <Icon name={COMPETENCY_INFO[c].icon} size={13} accent={false} />{COMPETENCY_INFO[c].name}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              </Rise>
            ))}
          </ul>
        </Panel>

        <div className="grid content-start gap-5">
          {/* Coverage map */}
          <Panel>
            <div className="flex items-baseline justify-between">
              <h3 className="t-h3">{t('coverage')}</h3>
              <span className="font-mono text-sm">{Math.round(team.score * 100)}%</span>
            </div>
            <ul className="mt-4 grid gap-2.5">
              {brief.needs.map((c) => {
                const lv = team.coverage[c];
                return (
                  <li key={c} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2"><Icon name={COMPETENCY_INFO[c].icon} size={18} />{COMPETENCY_INFO[c].name}</span>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[11px] uppercase',
                      lv === 2 ? 'bg-moss/15 text-tag' : lv === 1 ? 'bg-fjord/25 text-[#3F6577] dark:text-fjord' : 'bg-accent/10 text-accent-fg')}>
                      <span className={cn('h-2 w-2 rounded-full', lv === 2 ? 'bg-moss' : lv === 1 ? 'bg-fjord' : 'bg-accent')} />
                      {lv === 2 ? t('strong') : lv === 1 ? t('adequate') : t('gap')}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex justify-between border-t border-line pt-4 text-sm">
              <span className="text-muted">{t('diversity')}</span>
              <span className="font-mono">{Math.round(team.spread * 100)}%</span>
            </div>
          </Panel>

          {/* Wildcard */}
          {wild?.wildcard && (
            <Panel className="border-accent/40 bg-accent/[0.05]">
              <p className="t-label flex items-center gap-2 text-accent-fg!"><Icon name="wildcard" size={18} />{t('wildcard')}</p>
              <p className="mt-3 font-display text-lg font-semibold leading-snug">{t('wildcardIntro', { name: wild.name.split(' ')[0] })}</p>
              <p className="mt-2 text-sm"><span className="font-semibold">{wild.name}</span> <span className="text-muted">· {wild.role}, {wild.dept}</span></p>
              <p className="mt-2 text-sm text-muted">{wild.wildcard.evidence}</p>
            </Panel>
          )}

          {/* Busy */}
          {busy.length > 0 && (
            <Panel>
              <p className="t-label">{t('unavailableTitle')}</p>
              <ul className="mt-3 grid gap-2">
                {busy.map((p) => (
                  <li key={p.id} className="grid gap-1 text-sm opacity-75">
                    <span><span className="font-medium">{p.name}</span> <span className="text-muted">· {p.role}</span></span>
                    <span className="justify-self-start rounded-full bg-sunk px-2 py-0.5 text-xs text-muted">{p.availability.note}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
