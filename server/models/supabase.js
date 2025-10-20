import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabase() {
  if (client) return client;
  const URL = process.env.SUPABASE_URL;
  // Support a few common env var names to avoid misconfig
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY 
    || process.env.SUPABASE_API_KEY 
    || process.env.SUPABASE_ANON_KEY;
  if (!URL || !KEY) {
    console.warn('[supabase] Missing SUPABASE_URL or API KEY (SUPABASE_SERVICE_ROLE_KEY/SUPABASE_API_KEY). Set them in server/.env');
    throw new Error('Supabase not configured');
  }
  client = createClient(URL, KEY, { auth: { persistSession: false } });
  return client;
}

