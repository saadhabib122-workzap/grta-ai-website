'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/useReducedMotion';

/*
 * Hero visual: "switch on GRTA". Dark = the manager's usual three colleagues;
 * light = the whole organisation, zoomed out, with the hidden matches lit up.
 * Plays once when it comes into view; the slider and button let people replay it.
 */

type Match = { name: string; dept: string; skill: string };

const W = 800;
const H = 560;
const ME = { x: 400, y: 290 };
const USUAL = [{ x: 318, y: 238 }, { x: 482, y: 238 }, { x: 400, y: 382 }];
const DEPTS = [
  { x: 185, y: 135 }, { x: 615, y: 135 }, { x: 150, y: 300 },
  { x: 650, y: 300 }, { x: 235, y: 430 }, { x: 565, y: 430 },
];
// A small cloud of colleagues around each department (golden-angle spiral, so it is stable between renders)
const CLOUD = DEPTS.flatMap((d) => Array.from({ length: 9 }, (_, i) => {
  const a = i * 2.39996;
  const r = 26 + (i % 3) * 16;
  // Rounded: server and browser floats differ in the last digit, which breaks hydration
  return { x: Math.round(d.x + Math.cos(a) * r * 1.35), y: Math.round(d.y + Math.sin(a) * r) };
}));

export function BeforeAfter() {
  const t = useTranslations('hero.visual');
  const matches = t.raw('matches') as Match[];
  const usual = t.raw('usualNames') as string[];
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
      const eased = 1 - (1 - p) ** 3;
      setV(from + (target - from) * eased);
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
  const zoom = 1.45 - 0.45 * (v / 100); // the light view zooms out as it is revealed

  return (
    <figure className="m-0">
      <div ref={ref} role="img" aria-label={t('alt')} className="relative aspect-square overflow-hidden sm:aspect-[10/7] rounded-[28px] bg-slate shadow-lift">
        {/* Without GRTA */}
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {CLOUD.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="6" fill="#fff" opacity=".06" />)}
          {USUAL.map((p, i) => (
            <g key={i}>
              <line x1={ME.x} y1={ME.y} x2={p.x} y2={p.y} stroke="#8796A8" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="17" fill="#3A4757" stroke="#8796A8" strokeWidth="2" />
              <text x={p.x} y={p.y + 44} textAnchor="middle" fill="#C9D2DC" fontSize="20" fontWeight="600">{usual[i]}</text>
              <rect x={p.x - 28} y={p.y + 54} width="56" height="22" rx="11" fill="#4A2A22" />
              <text x={p.x} y={p.y + 70} textAnchor="middle" fill="#FFB48F" fontSize="13" fontWeight="600">{t('busy')}</text>
            </g>
          ))}
          <circle cx={ME.x} cy={ME.y} r="24" fill="#E8EDF3" />
          <text x={ME.x} y={ME.y + 7} textAnchor="middle" fill="#17212B" fontSize="20" fontWeight="700">?</text>
        </svg>

        {/* With GRTA: revealed from the left by the slider */}
        <div className="absolute inset-0 bg-mist" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
            <g style={{ transform: `scale(${zoom})`, transformOrigin: `${ME.x}px ${ME.y}px` }}>
              {CLOUD.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="6" fill="#B9C6D6" />)}
              {DEPTS.map((d, i) => (
                <line key={i} x1={ME.x} y1={ME.y} x2={d.x} y2={d.y} stroke="#E8551E" strokeWidth="2" strokeDasharray="5 6" opacity=".7" />
              ))}
              {USUAL.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="12" fill="#D5DDE7" />)}
              <circle cx={ME.x} cy={ME.y} r="22" fill="#1D4E89" />
              {DEPTS.map((d, i) => (
                <g key={i}>
                  <circle cx={d.x} cy={d.y} r="22" fill="#E8551E" opacity=".18" />
                  <circle cx={d.x} cy={d.y} r="13" fill="#E8551E" />
                  <text x={d.x} y={d.y + 40} textAnchor="middle" fill="#17212B" fontSize="20" fontWeight="700">{matches[i].name}</text>
                  <text x={d.x} y={d.y + 62} textAnchor="middle" fill="#556170" fontSize="15" className="max-sm:hidden">
                    {matches[i].dept} · {matches[i].skill}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Slider edge */}
        {v > 0 && v < 100 && <div aria-hidden className="absolute inset-y-0 w-0.5 bg-ember" style={{ left: `${v}%` }} />}

        <p className="absolute bottom-4 left-4 rounded-full max-sm:hidden bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate sm:bottom-6 sm:left-6 sm:text-sm">
          {on ? t('after') : t('before')}
        </p>

        {/* The question stays on top in both views */}
        <p className="absolute inset-x-0 top-4 mx-auto w-fit max-w-[90%] rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-slate shadow-soft sm:top-6 sm:text-base">
          {t('label')}
        </p>
        <p
          className="absolute right-4 bottom-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-soft transition-opacity duration-300 sm:right-6 sm:bottom-6 sm:text-sm"
          style={{ opacity: v > 85 ? 1 : 0 }}
        >
          {t('found', { count: matches.length })}
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
