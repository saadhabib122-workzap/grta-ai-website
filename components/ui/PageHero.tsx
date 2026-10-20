import type { ReactNode } from 'react';
import type { SlotName } from '@/components/brand/IllustrationSlot';
import { HeroCard } from './HeroCard';
import { cn } from '@/lib/cn';

/** Hero for inner pages: the shared HeroCard with label, headline, lead and actions. */
export function PageHero({ label, title, lead, children, slot, alt, focus }: {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  slot?: SlotName;
  alt?: string;
  focus?: string;
}) {
  return (
    <HeroCard slot={slot} alt={alt} focus={focus}>
      <p className="t-label mb-5">{label}</p>
      <h1 id="page-title" className={cn('t-h1', slot ? 'text-[clamp(2rem,1.4rem+1.6vw,2.75rem)]!' : false)}>{title}</h1>
      {lead && <p className="t-lead mt-5 max-w-2xl">{lead}</p>}
      {children && <div className="mt-8">{children}</div>}
    </HeroCard>
  );
}

/** Sticky in-page chapter links. */
export function ChapterNav({ items, label }: { items: Array<{ id: string; label: string }>; label: string }) {
  return (
    <nav aria-label={label} className="sticky top-[72px] z-30 mt-6 border-y border-line bg-bg/90 backdrop-blur-md">
      <ul className="wrap no-scrollbar flex gap-1 overflow-x-auto py-2 pl-[calc(var(--layout-gutter)-1rem)]!">
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted hover:bg-sunk hover:text-fg">
              <span className="font-mono text-xs text-tag">0{i + 1}</span>{it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
