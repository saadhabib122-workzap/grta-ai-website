'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

/** The two-minute pulse: five quick ratings, with a visible timer. */
export function Pulse({ tool }: { tool: 'brief' | 'translate' | 'team' | 'hiit' | 'network' }) {
  const t = useTranslations('lab.pulse');
  const questions = t.raw('questions') as string[];
  const scale = t.raw('scale') as [string, string];
  const [answers, setAnswers] = useState<number[]>(Array(5).fill(0));
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(0);
  const [start, setStart] = useState<number | null>(null);

  // The clock starts at the first answer
  useEffect(() => {
    if (done || start === null) return;
    const id = setInterval(() => setSecs(Math.round((performance.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [done, start]);

  // Event timestamps share the performance.now() clock
  function set(i: number, v: number, at: number) {
    if (start === null) setStart(at);
    setAnswers((a) => a.map((x, k) => (k === i ? v : x)));
  }

  async function submit() {
    setDone(true);
    try {
      await fetch('/api/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, answers, seconds: secs }),
      });
    } catch { /* feedback is best-effort */ }
  }

  if (done) return <p role="status" className="font-display text-lg font-semibold">{t('thanks')}</p>;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="t-h3">{t('title')}</h3>
          <p className="mt-1 text-sm text-muted">{t('lead')}</p>
        </div>
        <span className="font-mono text-sm tabular-nums text-tag" aria-label="seconds">{t('timer', { s: secs })} / 120s</span>
      </div>
      <ul className="mt-5 grid gap-3">
        {questions.map((q, i) => (
          <li key={q} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
            <span className="text-sm" id={`pq-${tool}-${i}`}>{q}</span>
            <div role="radiogroup" aria-labelledby={`pq-${tool}-${i}`} className="flex items-center gap-1.5">
              <span className="hidden text-xs text-muted sm:inline">{scale[0]}</span>
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} type="button" role="radio" aria-checked={answers[i] === v} aria-label={String(v)} onClick={(e) => set(i, v, e.timeStamp)}
                  className={cn('h-9 w-9 rounded-full border text-sm transition-colors',
                    answers[i] === v ? 'border-brand bg-brand text-on-brand' : 'border-line hover:border-brand')}>
                  {v}
                </button>
              ))}
              <span className="hidden text-xs text-muted sm:inline">{scale[1]}</span>
            </div>
          </li>
        ))}
      </ul>
      <Button className="mt-5" onClick={submit} disabled={answers.some((a) => a === 0)}>{t('submit')}</Button>
    </div>
  );
}
