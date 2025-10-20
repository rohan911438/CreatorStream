Server for Dune API Proxy and Off-chain Royalties/Payouts

Setup:
- Copy .env.example to .env and set DUNE_API_KEY.
- Run the server: npm run server (script added in package.json).
 - For Supabase-backed storage, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY for read-only).
 - FLOW_ACCESS_API can stay default until smart contract calls are added.

Endpoints:
- GET /api/health
- GET /api/dune/query/:queryId/results?limit=1000

- Off-chain royalties
	- GET /api/offchain/royalties
	- POST /api/offchain/royalties { marketplace, nftId, amountUSD, txHash?, note?, dateISO? }
	- GET /api/royalties/aggregate
	- POST /api/offchain/reconcile

- Collaborators (basic CRUD)
	- GET /api/collaborators
	- POST /api/collaborators { name, wallet, percentage?, role? }
	- PATCH /api/collaborators/:id
	- DELETE /api/collaborators/:id

- Payouts
	- POST /api/payouts { token: 'FLOW'|'USDC'|'FROTH', amountUSD, recipients: [{ wallet, percentage }] }
	- GET /api/payouts
	- GET /api/payouts/:id

- Creators (Supabase)
	- GET /api/creators
	- GET /api/creators/by-wallet/:wallet
	- POST /api/creators { wallet_address, name, preferred_token }

- Royalties (Supabase)
	- GET /api/royalties/:creatorId
	- POST /api/royalties { creator_id, nft_contract, nft_name?, sale_amount, royalty_percent, payout_token, marketplace, timestamp? }
	- PATCH /api/royalties/:id/paid
	- GET /api/royalties/:creatorId/unpaid/aggregate

- Forte prep (mock for Workflows)
	- GET /api/forte/prepare/:creatorId?token=USDC

Example forte prep JSON:
{
  "creator": "0xABC123",
  "total_unpaid": "125.50",
  "token": "USDC",
  "pending_transactions": [
    { "nft": "CoolCat #123", "royalty": "25.00", "marketplace": "OpenSea" },
    { "nft": "Pinnacle #9", "royalty": "100.50", "marketplace": "Disney" }
  ]
}

Notes:
- Uses in-memory caching (Dune) and JSON storage (server/data/db.json).
- Never expose DUNE_API_KEY in frontend; only set it in server/.env or env vars.
- Background workers simulate payout execution and periodic reconciliation.
- Supabase tables suggested schema:
	- creators(id uuid pk default uuid_generate_v4(), wallet_address text unique not null, name text, preferred_token text, created_at timestamptz default now())
	- royalties(id uuid pk default uuid_generate_v4(), creator_id uuid references creators(id), nft_contract text, nft_name text, sale_amount numeric, royalty_percent numeric, payout_token text, marketplace text, timestamp timestamptz default now(), paid boolean default false, paid_at timestamptz)
