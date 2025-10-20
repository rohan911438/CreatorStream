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
    .from('royalties')
    .select('id, nft_name, nft_contract, marketplace, royalty_percent, sale_amount, payout_token')
    .eq('creator_id', creator_id)
    .eq('paid', false);
  if (error) throw error;
  // Group by payout_token
  const byToken = new Map();
  for (const r of data) {
    const token = r.payout_token;
    if (!byToken.has(token)) byToken.set(token, []);
    byToken.get(token).push(r);
  }
  const out = [];
  for (const [token, rows] of byToken.entries()) {
    let total = 0;
    const pending_transactions = rows.map(r => {
      const royalty = Number(r.sale_amount) * Number(r.royalty_percent) / 100;
      total += royalty;
      return { nft: r.nft_name || r.nft_contract, royalty: royalty.toFixed(2), marketplace: r.marketplace };
    });
    out.push({ token, total_unpaid: total.toFixed(2), pending_transactions });
  }
  return out;
}
