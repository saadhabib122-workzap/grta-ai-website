'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/*
 * The "luminous threads" motif, alive: drifting nodes joined by fine lines,
 * gently drawn toward the pointer. Pauses off-screen; static for reduced motion.
 */
export function ThreadField({ className, density = 0.00005, accentNode = true }: {
  className?: string;
  /** nodes per square pixel */
  density?: number;
  accentNode?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const pointer = { x: -9999, y: -9999 };
    let seed = 42;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const color = () => getComputedStyle(document.documentElement).getPropertyValue('--thread').trim() || '#5E889C';
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#E8551E';
    let thread = color(), ember = accent();

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas!.width = w * dpr; canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(14, Math.min(70, Math.round(w * h * density)));
      seed = 42;
      nodes = Array.from({ length: n }, () => ({
        x: rnd() * w, y: rnd() * h,
        vx: (rnd() - 0.5) * 0.18, vy: (rnd() - 0.5) * 0.18,
        r: rnd() < 0.2 ? 2.4 : 1.4,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const max = Math.min(180, Math.max(110, w / 9));
      ctx!.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx!.globalAlpha = (1 - d / max) * 0.55;
            ctx!.strokeStyle = thread;
            ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
          }
        }
        const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dp < max * 1.2) {
          ctx!.globalAlpha = (1 - dp / (max * 1.2)) * 0.8;
          ctx!.strokeStyle = thread;
          ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(pointer.x, pointer.y); ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 0.9;
      nodes.forEach((n, i) => {
        ctx!.fillStyle = accentNode && i === 0 ? ember : thread;
        ctx!.beginPath(); ctx!.arc(n.x, n.y, accentNode && i === 0 ? 3.2 : n.r, 0, Math.PI * 2); ctx!.fill();
      });
      ctx!.globalAlpha = 1;
    }

    function step() {
      for (const n of nodes) {
        const dx = pointer.x - n.x, dy = pointer.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 1) { n.vx += (dx / d) * 0.006; n.vy += (dy / d) * 0.006; }
        n.vx *= 0.995; n.vy *= 0.995;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp < 0.05) { n.vx += (Math.random() - 0.5) * 0.02; n.vy += (Math.random() - 0.5) * 0.02; }
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
      }
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(step);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    const restart = () => { cancelAnimationFrame(raf); if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(step); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); });
    const ro = new ResizeObserver(() => { resize(); draw(); });
    const mo = new MutationObserver(() => { thread = color(); ember = accent(); draw(); });

    resize(); draw();
    io.observe(canvas); ro.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const host = canvas.parentElement ?? canvas;
    if (!reduce) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', restart);
      restart();
    }
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', restart);
    };
  }, [density, accentNode]);

  return <canvas ref={ref} aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} />;
}
