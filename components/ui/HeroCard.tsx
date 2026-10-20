import type { ReactNode } from 'react';
import { IllustrationSlot, type SlotName } from '@/components/brand/IllustrationSlot';
import { cn } from '@/lib/cn';

/*
 * The hero used on every page: a rounded card centred between equal page margins.
 * - On desktop the nav floats over the top of the card, and the text sits on the left
 *   on a soft fade, starting exactly on the .wrap content line (same as the logo).
 * - variant "full": the art fills the whole card (home).
 * - variant "side": the art fills the right part of the card and fades in from the
 *   left, so any composition works (inner pages).
 * - On mobile the art sits on top and the text follows below, inside the same card.
 */
export function HeroCard({ slot, alt, focus = '50% 50%', variant = 'side', priority = true, children, id = 'page-title' }: {
  slot?: SlotName;
  alt?: string;
  focus?: string;
  variant?: 'full' | 'side';
  priority?: boolean;
  children: ReactNode;
  /** id of the heading inside, for aria-labelledby */
  id?: string;
}) {
  const full = variant === 'full';
  return (
    <section aria-labelledby={id} className="frame pt-[calc(72px+var(--layout-frame))] pb-[var(--layout-frame)] lg:pt-[var(--layout-frame)]">
      <div className="relative isolate overflow-hidden bg-surface ring-1 ring-line">
        {slot && alt && (
          <div
            className={cn(
              /* below lg the full art shows at its own ratio, so no one is cropped out */
              full ? 'relative aspect-[43/24]' : 'relative aspect-[4/3] sm:aspect-[16/9]',
              full
                ? 'lg:absolute lg:inset-y-0 lg:right-0 lg:left-[24%] lg:aspect-auto xl:left-[12%]'
                : 'lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_28%)]',
            )}
          >
            <IllustrationSlot cover slot={slot} alt={alt} priority={priority} focus={focus} sizes={full ? '(min-width: 1600px) 1400px, (min-width: 1024px) 90vw, 100vw' : '(min-width: 1600px) 900px, (min-width: 1024px) 58vw, 100vw'} className="bg-transparent" />
            {full && (
              /* soft fade that carries the text, like a sheet of paper over the scene */
              <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--surface)_0%,var(--surface)_14%,color-mix(in_oklab,var(--surface)_75%,transparent)_24%,color-mix(in_oklab,var(--surface)_25%,transparent)_34%,transparent_42%)] lg:block" />
            )}
            {/* top scrim so the nav stays readable over bright art */}
            <div aria-hidden className="absolute inset-x-0 top-0 hidden h-[140px] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface)_80%,transparent)_0%,transparent_100%)] lg:block" />
          </div>
        )}
        <div
          className={cn(
            'frame-pad relative pt-8 pb-10 lg:flex lg:items-center lg:pt-[96px] lg:pb-16',
            full ? 'lg:min-h-[clamp(560px,46vw,640px)]' : slot ? 'lg:min-h-[480px]' : false,
          )}
        >
          <div className={cn('animate-[rise_.6s_var(--ease)_both]', slot ? 'lg:max-w-[38%]' : 'max-w-3xl')}>{children}</div>
        </div>
      </div>
    </section>
  );
}
