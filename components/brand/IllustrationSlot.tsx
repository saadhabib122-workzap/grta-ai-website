import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import slots from '@/lib/illustration-slots.json';
import manifest from '@/lib/illustration-manifest.json';

/*
 * Illustration slots from brand/illustration-bible.md.
 * Drop final art into public/illustrations/<slot>.webp and it replaces the
 * placeholder automatically. The ratio is fixed, so layout never shifts.
 */
/* Slot sizes live in lib/illustration-slots.json, shared with tools/add_illustration.js */
export const SLOTS = slots;

export type SlotName = keyof typeof slots;

const EXTS = ['webp', 'avif', 'png', 'jpg'];

function findArt(slot: SlotName) {
  // Preferred: content-hashed file written by tools/add_illustration.js
  const hashed = (manifest as Record<string, string>)[slot];
  if (hashed && fs.existsSync(path.join(process.cwd(), 'public', 'illustrations', hashed))) {
    return `/illustrations/${hashed}`;
  }
  // Fallback: a file dropped in by hand as <slot>.webp / .avif / .png / .jpg
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'illustrations', `${slot}.${ext}`))) {
      return `/illustrations/${slot}.${ext}`;
    }
  }
  return null;
}

export function IllustrationSlot({ slot, alt, priority = false, className, sizes = '(min-width: 1024px) 50vw, 100vw', cover = false, focus = '50% 50%' }: {
  slot: SlotName;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** Fill the parent (full-bleed backgrounds) instead of a framed, fixed-ratio card */
  cover?: boolean;
  /** CSS object-position: which part of the image stays in view when cropped */
  focus?: string;
}) {
  const s = SLOTS[slot];
  const art = findArt(slot);
  return (
    <div
      className={cn('overflow-hidden bg-birch', cover ? 'absolute inset-0' : 'relative rounded-xl ring-1 ring-line', className)}
      style={cover ? undefined : { aspectRatio: `${s.ratio[0]}/${s.ratio[1]}` }}
    >
      {art ? (
        <Image src={art} alt={alt} fill sizes={sizes} priority={priority} quality={90} className="object-cover" style={{ objectPosition: focus }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/illustrations/placeholders/${s.placeholder}`} alt={alt} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focus }} />
      )}
    </div>
  );
}
