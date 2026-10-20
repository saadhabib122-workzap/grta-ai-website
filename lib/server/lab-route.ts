import 'server-only';
import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { structured } from '@/lib/ai/claude';
import { clientKey, rateLimit, takeAiBudget } from './ratelimit';
import { supabaseAdmin } from './supabase';

/*
 * Shared handler for Lab endpoints: validate input, rate limit, try Claude,
 * fall back to the built-in engine, optionally log an anonymous session.
 */
export async function handleLab<S extends z.ZodType>(req: Request, opts: {
  tool: 'brief' | 'translate' | 'hiit';
  field: string;
  min: number;
  max: number;
  system: string;
  schema: S;
  local: (text: string) => z.infer<S>;
}) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }); }

  const text = typeof body[opts.field] === 'string' ? (body[opts.field] as string).trim() : '';
  if (text.length < opts.min) return NextResponse.json({ error: 'tooShort' }, { status: 400 });
  const input = text.slice(0, opts.max);

  const key = clientKey(req);
  const limited = !rateLimit(`lab:${key}`, { limit: 30, windowMs: 60 * 60 * 1000 }).ok;

  let data: z.infer<S> | null = null;
  let engine: 'ai' | 'local' = 'local';
  if (!limited && takeAiBudget()) {
    data = await structured({ system: opts.system, user: input, schema: opts.schema });
    if (data) engine = 'ai';
  }
  if (!data) data = opts.local(input);

  if (body.save === true) {
    // Anonymous, opt-in: no IP, no names. Fire and forget.
    void supabaseAdmin()?.from('lab_sessions').insert({ tool: opts.tool, input, output: data, engine }).then(() => {}, () => {});
  }

  return NextResponse.json({ data, engine, limited });
}
