import 'server-only';
import { createHash } from 'node:crypto';

/*
 * Small fixed-window rate limiter keyed by a hashed IP.
 * In-memory, so it's per server instance: good enough to protect the demo
 * budget. Swap for the Supabase `rate_limits` table when running many instances.
 */

const windows = new Map<string, { count: number; reset: number }>();

export function clientKey(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  return createHash('sha256').update(ip + (process.env.RATE_LIMIT_SALT ?? 'grta')).digest('hex').slice(0, 24);
}

export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now();
  const w = windows.get(key);
  if (!w || w.reset < now) {
    windows.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  w.count++;
  if (windows.size > 5000) for (const [k, v] of windows) if (v.reset < now) windows.delete(k);
  return { ok: w.count <= limit, remaining: Math.max(0, limit - w.count) };
}

/* Global daily cap on AI calls, so a traffic spike can't run up the bill. */
let day = '';
let aiCalls = 0;
export function takeAiBudget() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; aiCalls = 0; }
  const cap = Number(process.env.LAB_DAILY_AI_CAP ?? 500);
  if (aiCalls >= cap) return false;
  aiCalls++;
  return true;
}
