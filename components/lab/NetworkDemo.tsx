'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { Panel } from './LabShell';

/* 7×7: one guide helps six; each guide belongs to a group one layer up. */
const WEEKS_PER_LAYER = 3;

function model(n: number) {
  const layers = Math.max(1, Math.ceil(Math.log(n) / Math.log(7)));
  const guides = Math.max(1, Math.ceil((n - 1) / 6));
  return { layers, guides, weeks: layers * WEEKS_PER_LAYER };
}

export function NetworkDemo() {
  const t = useTranslations('lab.network');
  const [size, setSize] = useState(1200);
  const [run, setRun] = useState(0);
  const m = useMemo(() => model(size), [size]);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = rect.width * dpr; c.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = rect.width / 2, cy = rect.height / 2;
    const css = getComputedStyle(document.documentElement);
    const thread = css.getPropertyValue('--thread').trim();
    const accent = css.getPropertyValue('--accent').trim();
    const brand = css.getPropertyValue('--brand').trim();

    // Build a visual tree, capped so huge organisations stay legible
    type N = { x: number; y: number; depth: number; parent?: N };
    const nodes: N[] = [{ x: cx, y: cy, depth: 0 }];
    const maxDepth = Math.min(m.layers, 3);
    const R = Math.min(rect.width, rect.height) / 2 - 14;
    let frontier = [nodes[0]];
    for (let d = 1; d <= maxDepth; d++) {
      const next: N[] = [];
      const count = Math.min(6 ** d, 216);
      frontier.forEach((p, pi) => {
        const kids = Math.max(1, Math.round(count / frontier.length));
        for (let k = 0; k < kids; k++) {
          const a = ((pi * kids + k) / count) * Math.PI * 2 + d * 0.3;
          const r = (R * d) / maxDepth;
          next.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, depth: d, parent: p });
        }
      });
      nodes.push(...next);
      frontier = next;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0, raf = 0;
    const total = 60 * maxDepth;
    function draw() {
      const progress = reduce ? maxDepth + 1 : (frame / total) * (maxDepth + 1);
      ctx!.clearRect(0, 0, rect.width, rect.height);
      for (const n of nodes) {
        const vis = Math.min(1, Math.max(0, progress - n.depth));
        if (vis <= 0) continue;
        if (n.parent) {
          ctx!.globalAlpha = 0.5 * vis;
          ctx!.strokeStyle = thread; ctx!.lineWidth = 0.8;
          ctx!.beginPath(); ctx!.moveTo(n.parent.x, n.parent.y);
          ctx!.lineTo(n.parent.x + (n.x - n.parent.x) * vis, n.parent.y + (n.y - n.parent.y) * vis); ctx!.stroke();
        }
        ctx!.globalAlpha = vis;
        ctx!.fillStyle = n.depth === 0 ? accent : n.depth === maxDepth ? thread : brand;
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.depth === 0 ? 7 : Math.max(2, 5 - n.depth), 0, Math.PI * 2); ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      if (!reduce && frame < total) { frame++; raf = requestAnimationFrame(draw); }
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [m.layers, run]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <Panel>
        <label htmlFor="org-size" className="text-sm font-medium">{t('sizeLabel')}</label>
        <p className="mt-2 font-display text-5xl font-extrabold">{size.toLocaleString('en-GB')}</p>
        <input id="org-size" type="range" min={20} max={50000} step={10} value={size}
          onChange={(e) => setSize(Number(e.target.value))} className="mt-4 w-full accent-[var(--brand)]" />
        <dl className="mt-8 grid grid-cols-3 gap-4">
          <div><dt className="t-label">{t('guides')}</dt><dd className="mt-1 font-display text-3xl font-bold tabular-nums">{m.guides.toLocaleString('en-GB')}</dd></div>
          <div><dt className="t-label">{t('layers')}</dt><dd className="mt-1 font-display text-3xl font-bold">{m.layers}</dd></div>
          <div><dt className="t-label">{t('weeks')}</dt><dd className="mt-1 font-display text-3xl font-bold">{m.weeks}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted">{t('weeksNote', { n: WEEKS_PER_LAYER })}</p>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="mt-6 inline-flex items-center gap-2 font-semibold text-brand hover:underline underline-offset-4">
          <Icon name="network-7x7" size={18} />{t('replay')}
        </button>
      </Panel>
      <Panel className="bg-bg p-2!">
        <canvas ref={canvas} aria-label={`${m.layers} layers, ${m.guides} guides`} role="img" className="aspect-square w-full" />
      </Panel>
    </div>
  );
}
