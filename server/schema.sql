-- Run this in Supabase SQL editor
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  name text,
  preferred_token text check (preferred_token in ('FLOW','USDC','FROTH')),
  created_at timestamptz default now()
);

create table if not exists public.royalties (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade,
  nft_contract text not null,
  nft_name text,
  sale_amount numeric not null,
  royalty_percent numeric not null,
  payout_token text not null check (payout_token in ('FLOW','USDC','FROTH')),
  marketplace text not null,
  timestamp timestamptz default now(),
  paid boolean default false,
  paid_at timestamptz
);

create index if not exists royalties_creator_id_idx on public.royalties(creator_id);
create index if not exists royalties_paid_idx on public.royalties(paid);