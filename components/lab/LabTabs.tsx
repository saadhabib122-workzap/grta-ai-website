'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

export const LAB_TABS = ['brief', 'translate', 'team', 'hiit', 'network'] as const;
export type LabTab = (typeof LAB_TABS)[number];
const ICONS: Record<LabTab, string> = { brief: 'brief', translate: 'translate', team: 'variants', hiit: 'hiit', network: 'network-7x7' };

/** Tabs that follow the URL hash, so /lab#translate is shareable. */
export function LabTabs({ panels }: { panels: Record<LabTab, ReactNode> }) {
  const t = useTranslations('lab.tabs');
  const [tab, setTab] = useState<LabTab>('brief');

  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1) as LabTab;
      if (LAB_TABS.includes(h)) setTab(h);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  function select(next: LabTab) {
    setTab(next);
    history.replaceState(null, '', `#${next}`);
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = LAB_TABS[(i + (e.key === 'ArrowRight' ? 1 : LAB_TABS.length - 1)) % LAB_TABS.length];
    select(next);
    document.getElementById(`lab-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Lab" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,#000_85%,transparent)] sm:mx-0 sm:px-0 sm:[mask-image:none]">
        {LAB_TABS.map((k, i) => (
          <button
            key={k}
            id={`lab-tab-${k}`}
            role="tab"
            aria-selected={tab === k}
            aria-controls={`lab-panel-${k}`}
            tabIndex={tab === k ? 0 : -1}
            onClick={() => select(k)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn('inline-flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 font-semibold transition-colors',
              tab === k ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface text-muted hover:text-fg')}
          >
            <Icon name={ICONS[k]} size={18} accent={tab !== k} />
            {t(k)}
          </button>
        ))}
      </div>
      {LAB_TABS.map((k) => (
        <div key={k} id={`lab-panel-${k}`} role="tabpanel" aria-labelledby={`lab-tab-${k}`} hidden={tab !== k} className="mt-8">
          {tab === k && panels[k]}
        </div>
      ))}
    </div>
  );
}
