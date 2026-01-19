import { getSupabase } from './supabase.js';

// royalties table minimal columns:
// id (uuid) | creator_id (uuid) | nft_contract (text) | nft_name (text) | sale_amount (numeric) | royalty_percent (numeric)
// payout_token (text) | marketplace (text) | timestamp (timestamptz) | paid (boolean) | paid_at (timestamptz)

export async function addRoyalty(entry) {
  const now = new Date().toISOString();
  const payload = { timestamp: now, paid: false, ...entry };
  const { data, error } = await getSupabase()
    .from('royalties')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listRoyaltiesByCreator(creator_id, { unpaidOnly = false } = {}) {
  let q = getSupabase()
    .from('royalties')
    .select('*')
    .eq('creator_id', creator_id)
    .order('timestamp', { ascending: false });
  if (unpaidOnly) q = q.eq('paid', false);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function markRoyaltyPaid(id) {
  const { data, error } = await getSupabase()
    .from('royalties')
    .update({ paid: true, paid_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Aggregate unpaid royalties per creator grouped by payout_token
export async function aggregateUnpaidByCreator(creator_id) {
  const { data, error } = await getSupabase()
    .rpc('aggregate_unpaid_by_creator', { creator_id_param: creator_id });

  if (error) throw error;
  return data.map(d => ({
    ...d,
    total_unpaid: d.total_unpaid.toFixed(2),
    pending_transactions: d.pending_transactions.map(tx => ({ ...tx, royalty: tx.royalty.toFixed(2) }))
  }));
}
