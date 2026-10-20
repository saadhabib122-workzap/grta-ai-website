'use client';

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

/*
 * Small animated product mock-ups for the How it works journey.
 * Each one loops through a few stages while on screen. The first render and
 * reduced-motion users get the finished state, so nothing looks empty.
 */

function useStage(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(count - 1);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) {
        setTick(0);
        timer = setInterval(() => setTick((t) => (t + 1) % count), ms);
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [count, ms, reduce]);

  return [ref, reduce ? count - 1 : tick] as const;
}

function Frame({ frameRef, label, icon, children }: { frameRef: RefObject<HTMLDivElement | null>; label: string; icon: string; children: ReactNode }) {
  return (
    <div ref={frameRef} className="card relative overflow-hidden p-5 shadow-soft sm:p-6">
      <div aria-hidden className="threads-bg pointer-events-none absolute -top-10 -right-10 h-40 w-40 opacity-30 [mask-image:radial-gradient(circle,#000_20%,transparent_70%)]" />
      <div className="relative mb-5 flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-tag">
          <Icon name={icon} size={16} />{label}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />GRTA
        </span>
      </div>
      <div className="relative min-h-[250px]">{children}</div>
    </div>
  );
}

const show = (on: boolean) => cn('transition-all duration-500 ease-brand', on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5');

function Row({ on, label, children }: { on: boolean; label: string; children: ReactNode }) {
  return (
    <div className={cn('grid grid-cols-[88px_1fr] items-center gap-3', show(on))}>
      <dt className="t-label">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/* 1 · Zero blank page */
export function BriefArtifact() {
  const t = useTranslations('how.artifacts.brief');
  const [ref, s] = useStage(8, 850);
  const roles = t.raw('roleList') as string[];
  return (
    <Frame frameRef={ref} label={t('label')} icon="brief">
      <p className={cn('rounded-lg border border-dashed border-line bg-bg p-3.5 text-sm leading-relaxed text-muted transition-opacity duration-500', s >= 1 && 'opacity-55')}>
        “{t('input')}”{s === 0 && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-fg align-middle" />}
      </p>
      <div className="my-3 flex justify-center text-thread">
        <Icon name="arrow-right" size={20} accent={false} className={cn('rotate-90 transition-opacity duration-500', s >= 1 ? 'opacity-100' : 'opacity-30')} />
      </div>
      <dl className="grid gap-3 rounded-lg bg-bg p-4">
        <Row on={s >= 1} label={t('goal')}><span className="font-display font-semibold">{t('goalValue')}</span></Row>
        <Row on={s >= 2} label={t('timeline')}><span className="font-mono text-sm">{t('timelineValue')}</span></Row>
        <Row on={s >= 3} label={t('roles')}>
          <div className="flex flex-wrap gap-1.5">
            {roles.map((r, i) => (
              <span key={r} className={cn('rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs', show(s >= 3))} style={{ transitionDelay: `${i * 90}ms` }}>{r}</span>
            ))}
          </div>
        </Row>
      </dl>
    </Frame>
  );
}

/* 2 · Gap detection */
export function GapArtifact() {
  const t = useTranslations('how.artifacts.gap');
  const [ref, s] = useStage(9, 800);
  const have = t.raw('have') as string[];
  const added = s >= 7;
  return (
    <Frame frameRef={ref} label={t('label')} icon="gap">
      <ul className="grid gap-2">
        {have.map((h, i) => (
          <li key={h} className="flex items-center justify-between rounded-md border border-line bg-bg px-3.5 py-2.5 text-sm">
            {h}
            <span className={cn('grid h-5 w-5 place-items-center rounded-full bg-moss/20 text-tag transition-all duration-300', s >= i + 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0')}>
              <Icon name="check" size={13} accent={false} />
            </span>
          </li>
        ))}
        <li className={cn('flex items-center justify-between rounded-md px-3.5 py-2.5 text-sm transition-all duration-500',
          added ? 'border border-line bg-bg' : 'border border-dashed border-accent/60 bg-accent/[0.06]', show(s >= 4))}>
          <span className="flex items-center gap-2">{!added && <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />}{t('missing')}</span>
          {added && <span className="grid h-5 w-5 place-items-center rounded-full bg-moss/20 text-tag"><Icon name="check" size={13} accent={false} /></span>}
        </li>
      </ul>
      <div className={cn('mt-4 rounded-lg border bg-surface p-3.5 shadow-soft transition-colors duration-500', added ? 'border-line' : 'border-accent/30', show(s >= 4))}>
        <p className="text-sm">{t('message')}</p>
        <span className={cn('mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-500',
          added ? 'bg-moss/15 text-tag' : 'bg-brand text-on-brand')}>
          {added && <Icon name="check" size={14} accent={false} />}
          {added ? t('added') : t('add')}
        </span>
      </div>
    </Frame>
  );
}

/* 3 · Plain-language translation */
export function TranslateArtifact() {
  const t = useTranslations('how.artifacts.translate');
  const [ref, s] = useStage(8, 800);
  const tags = t.raw('tags') as Array<{ label: string; value: number }>;
  return (
    <Frame frameRef={ref} label={t('label')} icon="translate">
      <p className="font-display text-xl font-semibold leading-snug">“{t('quote')}”</p>
      <div className="my-4 flex items-center gap-2 text-thread">
        <span className={cn('h-px flex-1 bg-current transition-opacity duration-500', s >= 1 ? 'opacity-100' : 'opacity-20')} />
        <Icon name="translate" size={18} />
        <span className={cn('h-px flex-1 bg-current transition-opacity duration-500', s >= 1 ? 'opacity-100' : 'opacity-20')} />
      </div>
      <ul className="grid gap-2.5">
        {tags.map((tag, i) => (
          <li key={tag.label} className={cn('rounded-lg border border-line bg-bg px-3.5 py-2.5', show(s >= i + 2))}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold">{tag.label}</span>
              <span className="font-mono text-xs text-tag">{tag.value}%</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sunk">
              <div className="h-full rounded-full bg-thread transition-[width] duration-700 ease-brand" style={{ width: s >= i + 2 ? `${tag.value}%` : '0%' }} />
            </div>
          </li>
        ))}
      </ul>
      <p className={cn('mt-3 text-xs text-muted', show(s >= 5))}>{t('because')}</p>
    </Frame>
  );
}

/* 4 · Availability first */
export function AvailabilityArtifact() {
  const t = useTranslations('how.artifacts.availability');
  const [ref, s] = useStage(8, 750);
  const people = t.raw('people') as Array<{ name: string; role: string; status: 'available' | 'partial' | 'busy'; note?: string }>;
  return (
    <Frame frameRef={ref} label={t('label')} icon="availability">
      <ul className="grid gap-2">
        {people.map((p, i) => {
          const known = s >= i + 1;
          const busy = known && p.status === 'busy';
          return (
            <li key={p.name} className={cn('flex items-center gap-3 rounded-lg border border-line bg-bg px-3 py-2.5 transition-opacity duration-500', busy && 'opacity-45')}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay font-display text-xs font-bold text-ink">
                {p.name.split(' ').map((n) => n[0]).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-semibold', busy && 'line-through decoration-1')}>{p.name}</p>
                <p className="truncate text-xs text-muted">{p.role}</p>
              </div>
              {known ? (
                <span className={cn('shrink-0 animate-[rise_.35s_var(--ease)_both] rounded-full px-2.5 py-0.5 text-xs',
                  p.status === 'available' ? 'bg-moss/15 text-tag' : p.status === 'partial' ? 'bg-fjord/25 text-[#3F6577] dark:text-fjord' : 'bg-sunk text-muted')}>
                  {p.status === 'available' ? t('available') : p.note}
                </span>
              ) : (
                <span className="h-4 w-16 shrink-0 animate-pulse rounded-full bg-sunk" />
              )}
            </li>
          );
        })}
      </ul>
      <p className={cn('mt-3 flex items-center gap-2 text-xs text-muted', show(s >= people.length + 1))}>
        <Icon name="availability" size={15} accent={false} />{t('hidden')}
      </p>
    </Frame>
  );
}

/* 5 · Team variants and the wildcard, with the coverage map */
const COVERAGE: Array<Array<0 | 1 | 2>> = [
  [2, 2, 1, 2, 1, 1], // Execution
  [1, 2, 2, 1, 2, 2], // Challenger
  [1, 1, 2, 1, 0, 2], // Innovation
];

export function VariantsArtifact() {
  const t = useTranslations('how.artifacts.variants');
  const [ref, s] = useStage(3, 2400);
  const names = t.raw('names') as string[];
  const rows = t.raw('rows') as string[];
  const levels = COVERAGE[s];
  const score = Math.round((levels.reduce<number>((a, l) => a + (l === 2 ? 1 : l === 1 ? 0.6 : 0), 0) / levels.length) * 100);
  const word = (l: number) => (l === 2 ? t('strong') : l === 1 ? t('adequate') : t('gap'));
  return (
    <Frame frameRef={ref} label={t('label')} icon="variants">
      <div className="grid grid-cols-3 gap-1 rounded-full border border-line bg-bg p-1 text-center text-xs font-semibold">
        {names.map((n, i) => (
          <span key={n} className={cn('rounded-full py-1.5 transition-colors duration-500', s === i ? 'bg-brand text-on-brand' : 'text-muted')}>{n}</span>
        ))}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="t-label">{t('coverage')}</span>
        <span className="font-mono text-sm tabular-nums">{score}%</span>
      </div>
      <ul className="mt-2.5 grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {rows.map((r, i) => (
          <li key={r} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate">{r}</span>
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase transition-colors duration-500',
              levels[i] === 2 ? 'bg-moss/15 text-tag' : levels[i] === 1 ? 'bg-fjord/25 text-[#3F6577] dark:text-fjord' : 'bg-accent/10 text-accent-fg')}>
              <span className={cn('h-1.5 w-1.5 rounded-full transition-colors duration-500', levels[i] === 2 ? 'bg-moss' : levels[i] === 1 ? 'bg-fjord' : 'bg-accent')} />
              {word(levels[i])}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-accent/35 bg-accent/[0.05] p-3">
        <Icon name="wildcard" size={20} />
        <p className="text-sm"><span className="font-semibold">{t('wildcardTitle')}</span> <span className="text-muted">{t('wildcard')}</span></p>
      </div>
    </Frame>
  );
}

/* 6 · Two-minute pulse */
const RATINGS = [5, 4, 4, 5, 3];

export function PulseArtifact() {
  const t = useTranslations('how.artifacts.pulse');
  const [ref, s] = useStage(9, 650);
  const qs = t.raw('questions') as string[];
  const answered = Math.min(s, qs.length);
  return (
    <Frame frameRef={ref} label={t('label')} icon="pulse">
      <div className="mb-3 flex justify-end font-mono text-xs tabular-nums text-tag">{answered * 7 + 3}s / 120s</div>
      <ul className="grid gap-2.5">
        {qs.map((q, i) => (
          <li key={q} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{q}</span>
            <span className="flex shrink-0 gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <span key={v} className={cn('h-3.5 w-3.5 rounded-full border transition-colors duration-300',
                  i < answered && v <= RATINGS[i] ? 'border-brand bg-brand' : 'border-line bg-bg')} style={{ transitionDelay: `${v * 40}ms` }} />
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div className={cn('mt-5 flex items-center gap-3 rounded-lg bg-forest p-3.5 text-snow', show(s >= 6))}>
        <Icon name="spark" size={20} />
        <p className="text-sm"><span className="font-semibold">{t('learnedTitle')}</span> <span className="text-[#C9D3CC]">{t('learned')}</span></p>
      </div>
    </Frame>
  );
}

/* 7×7 network: a guide and six, linked to the next groups of seven */
function cluster(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (k * 60 - 90) * (Math.PI / 180);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

const GROUPS = [
  { c: { x: 170, y: 215 }, r: 58 },
  { c: { x: 380, y: 100 }, r: 46 },
  { c: { x: 395, y: 290 }, r: 42 },
];

export function NetworkArtifact({ guideLabel, memberLabel }: { guideLabel: string; memberLabel: string }) {
  const [ref, s] = useStage(5, 1100);
  const rings = GROUPS.map((g) => cluster(g.c.x, g.c.y, g.r));
  // A's guide also sits in group B (links to one of B's members); one of A's members guides group C
  const links = [
    { from: GROUPS[0].c, to: rings[1][4], stage: 1 },
    { from: rings[0][2], to: GROUPS[2].c, stage: 3 },
  ];
  const visible = (g: number) => (g === 0 ? true : g === 1 ? s >= 2 : s >= 4);

  return (
    <div ref={ref} className="card relative overflow-hidden p-4 shadow-soft">
      <svg viewBox="0 0 480 360" className="h-auto w-full" role="img" aria-label="7×7 network">
        {links.map((l, i) => (
          <path key={i} d={`M${l.from.x} ${l.from.y} Q ${(l.from.x + l.to.x) / 2} ${Math.min(l.from.y, l.to.y) - 30} ${l.to.x} ${l.to.y}`}
            fill="none" stroke="var(--thread)" strokeWidth="1.6" strokeDasharray="420" strokeDashoffset={s >= l.stage ? 0 : 420}
            style={{ transition: 'stroke-dashoffset 1s var(--ease-in-out)' }} />
        ))}
        {GROUPS.map((g, gi) => (
          <g key={gi} style={{ opacity: visible(gi) ? 1 : 0, transition: 'opacity .7s var(--ease)' }}>
            <circle cx={g.c.x} cy={g.c.y} r={g.r + 16} fill="var(--surface-sunk)" stroke="var(--border)" />
            {rings[gi].map((p, k) => (
              <line key={k} x1={g.c.x} y1={g.c.y} x2={p.x} y2={p.y} stroke="var(--thread)" strokeOpacity=".45" />
            ))}
            {rings[gi].map((p, k) => <circle key={k} cx={p.x} cy={p.y} r={gi === 0 ? 8 : 6.5} fill="var(--brand)" />)}
            <circle cx={g.c.x} cy={g.c.y} r={gi === 0 ? 12 : 9} fill="var(--accent)" />
          </g>
        ))}
      </svg>
      <div className="mt-1 flex gap-5 px-2 pb-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-accent" />{guideLabel}</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand" />{memberLabel}</span>
      </div>
    </div>
  );
}
