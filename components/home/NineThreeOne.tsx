'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/useReducedMotion';

/*
 * 9 → 3 → 1, animated: nine perspectives gather into three rooms, then converge
 * on one plan. Loops while visible; holds the final state for reduced motion.
 */

const ROOM_COLORS = ['var(--c-fjord)', '#A8C7A0', 'var(--c-clay)'];
const W = 520, H = 300;

const stage0 = Array.from({ length: 9 }, (_, i) => ({ x: 70 + (i % 3) * 64, y: 70 + Math.floor(i / 3) * 80 }));
const roomCenters = [{ x: 260, y: 60 }, { x: 260, y: 150 }, { x: 260, y: 240 }];
const stage1 = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3), k = i % 3, c = roomCenters[r];
  const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
  return { x: c.x + Math.cos(a) * 22, y: c.y + Math.sin(a) * 22 };
});
const final = { x: 450, y: 150 };
const stage2 = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2;
  return { x: final.x + Math.cos(a) * 10, y: final.y + Math.sin(a) * 10 };
});

export function NineThreeOne({ labels }: { labels: [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const stage = reduce ? 2 : tick;

  useEffect(() => {
    if (reduce) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setTick((s) => (s + 1) % 3), 2200);
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [reduce]);

  const pos = stage === 0 ? stage0 : stage === 1 ? stage1 : stage2;

  return (
    <div ref={ref} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={labels.join(' → ')}>
        {/* guide threads */}
        <g stroke="var(--c-fjord)" strokeOpacity=".25" fill="none">
          {roomCenters.map((c, i) => <path key={i} d={`M230 ${c.y} C 330 ${c.y}, 360 150, ${final.x - 18} 150`} />)}
        </g>
        {/* rooms */}
        {roomCenters.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="36" fill="none" stroke={ROOM_COLORS[i]}
            strokeOpacity={stage === 1 ? 0.7 : 0.15} strokeDasharray="3 4" className="transition-[stroke-opacity] duration-700" />
        ))}
        {/* the plan */}
        <circle cx={final.x} cy={final.y} r={stage === 2 ? 30 : 18} fill="none" stroke="var(--c-ember)"
          strokeOpacity={stage === 2 ? 0.9 : 0.3} className="transition-all duration-700" />
        {/* people */}
        {pos.map((p, i) => (
          <circle
            key={i}
            r={stage === 2 ? 4 : 7}
            fill={ROOM_COLORS[Math.floor(i / 3)]}
            style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: `transform 900ms var(--ease-in-out) ${i * 40}ms, r 600ms` }}
          />
        ))}
        <circle cx={final.x} cy={final.y} r="5" fill="var(--c-ember)" className={cn('transition-opacity duration-500', stage === 2 ? 'opacity-100' : 'opacity-0')} />
      </svg>
      <div className="mt-4 grid grid-cols-3 text-center font-mono text-xs uppercase tracking-widest">
        {labels.map((l, i) => (
          <span key={l} className={cn('transition-colors duration-500', stage === i ? 'text-snow' : 'text-[#7F958A]')}>{l}</span>
        ))}
      </div>
    </div>
  );
}
