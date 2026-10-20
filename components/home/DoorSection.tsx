'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { BriefDemo } from '@/components/lab/BriefDemo';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type Door = 'hr' | 'project';

/** "Pick your door": one switch personalises the panel and the live demo below it. */
export function DoorSection({ art }: { art: Record<Door, ReactNode> }) {
  const t = useTranslations('home.doors');
  const td = useTranslations('home.demo');
  const [door, setDoor] = useState<Door>('hr');
  const doors: Door[] = ['hr', 'project'];
  const challenges = t.raw(`${door}.challenges`) as string[];
  const useCases = t.raw(`${door}.useCases`) as string[];

  return (
    <>
      <section id="doors" aria-labelledby="doors-title" className="relative py-20 md:py-28">
        <div className="wrap">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="t-label mb-4">{t('label')}</p>
              <h2 id="doors-title" className="t-h2">{t('title')}</h2>
            </div>
            <div role="tablist" aria-label={t('label')} className="inline-flex rounded-full border border-line bg-surface p-1 shadow-soft">
              {doors.map((d) => (
                <button
                  key={d}
                  role="tab"
                  id={`door-tab-${d}`}
                  aria-selected={door === d}
                  aria-controls="door-panel"
                  onClick={() => setDoor(d)}
                  className={cn('h-11 rounded-full px-5 text-[0.95rem] font-semibold transition-colors',
                    door === d ? 'bg-brand text-on-brand' : 'text-muted hover:text-fg')}
                >
                  {t(`${d}.tab`)}
                </button>
              ))}
            </div>
          </div>

          <div id="door-panel" role="tabpanel" aria-labelledby={`door-tab-${door}`} key={door}
            className="mt-12 grid items-center gap-10 animate-[rise_.45s_var(--ease)_both] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="mx-auto w-full max-w-sm lg:max-w-none">{art[door]}</div>
            <div>
              <h3 className="t-h2 max-w-xl text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)]!">{t(`${door}.title`)}</h3>
              <p className="t-lead mt-4 max-w-xl">{t(`${door}.lead`)}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="t-label mb-3">{t(`${door}.challengesTitle`)}</p>
                  <ul className="grid gap-3">
                    {challenges.map((c) => (
                      <li key={c} className="flex gap-3 text-[0.97rem]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="t-label mb-3">{t(`${door}.useCasesTitle`)}</p>
                  <ul className="grid gap-3">
                    {useCases.map((c) => (
                      <li key={c} className="flex gap-3 text-[0.97rem]">
                        <Icon name="check" size={18} className="mt-0.5 text-tag" accent={false} />{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="try" aria-labelledby="try-title" className="relative bg-sunk py-20 md:py-28">
        <div className="wrap">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="t-label mb-4">{td('label')}</p>
              <h2 id="try-title" className="t-h2">{td('title')}</h2>
              <p className="t-lead mt-4">{td('lead')}</p>
            </div>
            <Link href="/lab" className="inline-flex items-center gap-2 font-semibold text-brand hover:underline underline-offset-4">
              {td('more')} <Icon name="arrow-right" size={18} accent={false} />
            </Link>
          </div>
          {/* key: a new door starts a fresh demo with that door's example */}
          <BriefDemo key={door} initialText={t(`${door}.demoPrompt`)} compact />
        </div>
      </section>
    </>
  );
}
