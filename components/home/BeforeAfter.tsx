'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/useReducedMotion';

/*
 * Hero visual: "switch on GRTA". Before = the manager and his usual colleagues,
 * dimmed; after = the zoomed-out office with everyone who fits lit up in orange.
 * Plays once when it comes into view; the slider and button let people replay it.
 */
export function BeforeAfter() {
  const t = useTranslations('hero.visual');
  const reduce = useReducedMotion();
  const [v, setV] = useState(0); // 0 = without GRTA, 100 = with GRTA
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  function animateTo(target: number) {
    cancelAnimationFrame(raf.current);
    if (reduce) { setV(target); return; }
    const from = v;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setV(from + (target - from) * (1 - (1 - p) ** 3));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }

  // Play once, shortly after the visual comes into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = setTimeout(() => animateTo(100), 1800);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once; animateTo reads the latest state when it fires
  }, []);

  const on = v >= 50;

  return (
    <figure className="m-0">
      <div ref={ref} role="img" aria-label={t('alt')} className="relative aspect-[1800/1005] overflow-hidden rounded-[28px] bg-white shadow-lift ring-1 ring-line">
        {/* Without GRTA: dimmed, as if the lights are off */}
        <Image src="/illustrations/hero-before.webp" alt="" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover brightness-[.45] saturate-[.7]" />

        {/* With GRTA: revealed from the left by the slider, zooming out as it opens */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src="/illustrations/hero-after.webp" alt="" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" style={{ transform: `scale(${1.15 - 0.15 * (v / 100)})` }} />
        </div>

        {v > 0 && v < 100 && <div aria-hidden className="absolute inset-y-0 w-0.5 bg-ember" style={{ left: `${v}%` }} />}

        <p className="absolute top-3 left-1/2 w-max max-w-[92%] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-center text-xs font-semibold text-slate shadow-soft sm:top-5 sm:text-base">
          {t('label')}
        </p>
        <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate sm:bottom-5 sm:left-5 sm:text-sm">
          {on ? t('after') : t('before')}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => animateTo(on ? 0 : 100)}
          aria-pressed={on}
          className="inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border border-line bg-white px-4 text-sm font-semibold text-fg shadow-soft hover:bg-sunk"
        >
          <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-ember' : 'bg-[#C3CCD7]'}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[left] ${on ? 'left-[18px]' : 'left-0.5'}`} />
          </span>
          {on ? t('switchOff') : t('switch')}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(v)}
          aria-label={t('slider')}
          onChange={(e) => { cancelAnimationFrame(raf.current); setV(Number(e.target.value)); }}
          className="w-full accent-ember"
        />
      </div>
    </figure>
  );
}
