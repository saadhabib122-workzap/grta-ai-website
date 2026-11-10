import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientKey, rateLimit } from '@/lib/server/ratelimit';

/* Contact requests and news sign-ups. Both go to the team's Google Sheet
   (Apps Script); the "mode" column tells them apart, so the sheet doubles as
   the news mailing list. */

const SHEET_URL =
  process.env.LEAD_SHEET_URL ??
  'https://script.google.com/macros/s/AKfycbxHPRmpfjVaE3yadP3xZueIoKkV6kiD2pBGm58UMpTid7yEXBZZQKuWn1qoITNpObtx/exec';

const Lead = z
  .object({
    name: z.string().trim().max(120).default(''),
    email: z.string().trim().email().max(200),
    company: z.string().trim().max(160).default(''),
    size: z.string().max(20).default(''),
    message: z.string().max(2000).default(''),
    consent: z.literal(true),
    mode: z.enum(['demo', 'contact', 'cocreate', 'news']).default('demo'),
    source: z.string().max(60).default('site'),
    website: z.string().optional(), // honeypot
  })
  // A news sign-up needs only an email; a contact request also needs a name and organisation
  .refine((l) => l.mode === 'news' || (l.name && l.company));

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientKey(req)}`, { limit: 8, windowMs: 60 * 60 * 1000 }).ok) {
    return NextResponse.json({ error: 'rateLimited' }, { status: 429 });
  }

  let parsed;
  try { parsed = Lead.safeParse(await req.json()); } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }); }
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const lead = parsed.data;
  if (lead.website) return NextResponse.json({ ok: true }); // bot: pretend success

  try {
    // Apps Script answers a POST with a redirect after writing the row, so any response means delivered.
    // "role" repeats the mode so the sheet's existing column keeps filling.
    await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ name: lead.name, email: lead.email, company: lead.company, size: lead.size, role: lead.mode, message: lead.message, mode: lead.mode, source: lead.source }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.error('[lead] could not reach the sheet', e);
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
