'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

type Screen = { id: string; label: string; alt: string };

/** Platform screenshots as tabs, labelled by the ABCD step each one shows. */
export function ScreenshotTabs() {
  const t = useTranslations('how');
  const screens = t.raw('screens') as Screen[];
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  // Arrow keys move between tabs, as screen-reader users expect from a tablist
  function onKeyDown(e: KeyboardEvent) {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = (active + step + screens.length) % screens.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <figure className="mx-auto mt-20 max-w-5xl">
      <div role="tablist" aria-label={t('screenshot')} onKeyDown={onKeyDown} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {screens.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`screen-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls="screen-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
              i === active ? 'bg-brand text-on-brand' : 'text-muted ring-1 ring-line hover:bg-sunk hover:text-fg',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div id="screen-panel" role="tabpanel" aria-labelledby={`screen-tab-${screens[active].id}`} className="mt-5 overflow-hidden rounded-[28px] bg-white shadow-lift ring-1 ring-line">
        <div aria-hidden className="flex gap-1.5 border-b border-[#E2E8EF] bg-[#F3F6FA] px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D5DDE7]" /><span className="h-2.5 w-2.5 rounded-full bg-[#D5DDE7]" /><span className="h-2.5 w-2.5 rounded-full bg-[#D5DDE7]" />
        </div>
        {/* All screens stay mounted so switching is instant; only the active one is visible */}
        <div className="relative aspect-[2000/1023]">
          {screens.map((s, i) => (
            <Image
              key={s.id}
              src={`/screens/${s.id}.webp`}
              alt={i === active ? s.alt : ''}
              aria-hidden={i !== active}
              fill
              sizes="(min-width: 1024px) 64rem, 100vw"
              className={cn('object-cover object-top transition-opacity duration-300', i === active ? 'opacity-100' : 'opacity-0')}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}
