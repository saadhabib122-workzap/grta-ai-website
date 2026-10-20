import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientKey, rateLimit } from '@/lib/server/ratelimit';
import { supabaseAdmin } from '@/lib/server/supabase';

/* Two-minute pulse after a Lab demo: five 1–5 ratings, anonymous. */

const Pulse = z.object({
  tool: z.enum(['brief', 'translate', 'team', 'hiit', 'network']),
  answers: z.array(z.number().int().min(1).max(5)).length(5),
  seconds: z.number().int().min(0).max(3600),
});

export async function POST(req: Request) {
  if (!rateLimit(`pulse:${clientKey(req)}`, { limit: 20, windowMs: 60 * 60 * 1000 }).ok) {
    return NextResponse.json({ error: 'rateLimited' }, { status: 429 });
  }
  let parsed;
  try { parsed = Pulse.safeParse(await req.json()); } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }); }
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { error } = (await supabaseAdmin()?.from('pulses').insert(parsed.data)) ?? { error: null };
  if (error) console.error('[pulse] insert failed', error.message);
  return NextResponse.json({ ok: true });
}
