import { getSupabase } from './supabase.js';

// creators table minimal columns:
// id (uuid) | wallet_address (text) | name (text) | preferred_token (text) | created_at (timestamptz)

export async function upsertCreator({ id, wallet_address, name, preferred_token }) {
  const payload = { wallet_address, name, preferred_token };
  if (id) payload.id = id;
  const { data, error } = await getSupabase()
    .from('creators')
    .upsert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getCreatorByWallet(wallet_address) {
  const { data, error } = await getSupabase()
    .from('creators')
    .select('*')
    .eq('wallet_address', wallet_address)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCreators(limit = 100) {
  const { data, error } = await getSupabase()
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
