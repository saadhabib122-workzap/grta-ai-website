'use client';

import { useCallback, useState } from 'react';

export type LabState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; data: T; engine: 'ai' | 'local'; limited?: boolean; fellBack?: boolean }
  | { status: 'error'; error: 'tooShort' | 'failed' };

/** POST to a Lab endpoint; if the network or server fails, run the built-in engine locally. */
export function useLabCall<T>(endpoint: string, local: (input: string) => T, field = 'text') {
  const [state, setState] = useState<LabState<T>>({ status: 'idle' });

  const run = useCallback(async (input: string) => {
    setState({ status: 'loading' });
    const started = Date.now();
    const minDelay = () => new Promise((r) => setTimeout(r, Math.max(0, 700 - (Date.now() - started))));
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: input }),
      });
      if (res.status === 400) {
        const j = await res.json().catch(() => ({}));
        if (j.error === 'tooShort') { setState({ status: 'error', error: 'tooShort' }); return; }
      }
      if (!res.ok) throw new Error(String(res.status));
      const j = await res.json();
      await minDelay();
      setState({ status: 'done', data: j.data as T, engine: j.engine, limited: j.limited });
    } catch {
      await minDelay();
      setState({ status: 'done', data: local(input), engine: 'local', fellBack: true });
    }
  }, [endpoint, local, field]);

  const reset = useCallback(() => setState({ status: 'idle' }), []);
  return { state, run, reset };
}
