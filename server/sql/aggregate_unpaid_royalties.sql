--  To apply this function, run this SQL query in your Supabase SQL editor.
--  This function aggregates unpaid royalties for a given creator, grouped by payout token.
--  It is a more efficient replacement for the in-app aggregation logic.

create or replace function aggregate_unpaid_by_creator(creator_id_param uuid)
returns table (
  token text,
  total_unpaid numeric,
  pending_transactions json
) as $$
begin
  return query
  select
    r.payout_token as token,
    sum((r.sale_amount * r.royalty_percent) / 100) as total_unpaid,
    json_agg(
      json_build_object(
        'nft', coalesce(r.nft_name, r.nft_contract),
        'royalty', (r.sale_amount * r.royalty_percent) / 100,
        'marketplace', r.marketplace
      )
    ) as pending_transactions
  from
    royalties r
  where
    r.creator_id = creator_id_param and r.paid = false
  group by
    r.payout_token;
end;
$$ language plpgsql;
