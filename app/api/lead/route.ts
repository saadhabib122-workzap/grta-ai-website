import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientKey, rateLimit } from '@/lib/server/ratelimit';
import { supabaseAdmin } from '@/lib/server/supabase';

/* Demo, waitlist and partner requests.
   Stored in Supabase when configured, and always forwarded to the existing
   Google Sheet (Apps Script) so the current workflow keeps working. */

const LEGACY_SHEET_URL =
  process.env.LEAD_SHEET_URL ??
  'https://script.google.com/macros/s/AKfycbxHPRmpfjVaE3yadP3xZueIoKkV6kiD2pBGm58UMpTid7yEXBZZQKuWn1qoITNpObtx/exec';

const Lead = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(1).max(160),
  size: z.string().max(20).optional().default(''),
  role: z.enum(['hr', 'project', 'partner', 'other']).optional().default('other'),
  message: z.string().max(2000).optional().default(''),
  consent: z.literal(true),
  mode: z.enum(['demo', 'waitlist', 'partner']).default('demo'),
  source: z.string().max(60).default('site'),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientKey(req)}`, { limit: 8, windowMs: 60 * 60 * 1000 }).ok) {
    return NextResponse.json({ error: 'rateLimited' }, { status: 429 });
  }

  let parsed;
  try { parsed = Lead.safeParse(await req.json()); } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }); }
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const lead = parsed.data;
  if (lead.website) return NextResponse.json({ ok: true }); // bot: pretend success

  const sb = supabaseAdmin();
  const [db, sheet] = await Promise.allSettled([
    sb
      ? sb.from('leads').insert({
          name: lead.name, email: lead.email, company: lead.company, size: lead.size,
          role: lead.role, message: lead.message, mode: lead.mode, source: lead.source, consent: true,
        }).then(({ error }) => { if (error) throw error; })
      : Promise.reject(new Error('supabase not configured')),
    // Apps Script answers a POST with a redirect after writing the row, so any response means delivered
    fetch(LEGACY_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      // Same fields as the old form, plus the new ones as extra columns
      body: JSON.stringify({ name: lead.name, email: lead.email, company: lead.company, size: lead.size, role: lead.role, message: lead.message, mode: lead.mode }),
      signal: AbortSignal.timeout(8000),
    }),
  ]);

  if (db.status === 'rejected' && sheet.status === 'rejected') {
    console.error('[lead] could not store lead', db.reason, sheet.reason);
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
  if (sb && db.status === 'rejected') console.error('[lead] supabase insert failed', db.reason);
  return NextResponse.json({ ok: true });
}
