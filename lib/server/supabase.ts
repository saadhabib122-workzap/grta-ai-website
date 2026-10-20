import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/* Server-side Supabase client (service role). Returns null until the
   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are set. */

let admin: SupabaseClient | null = null;

export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!admin) admin = createClient(url, key, { auth: { persistSession: false } });
  return admin;
}
