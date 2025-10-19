Server for Dune API Proxy and Off-chain Royalties/Payouts

Setup:
- Copy .env.example to .env and set DUNE_API_KEY.
- Run the server: npm run server (script added in package.json).

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

Notes:
- Uses in-memory caching (Dune) and JSON storage (server/data/db.json).
- Never expose DUNE_API_KEY in frontend; only set it in server/.env or env vars.
- Background workers simulate payout execution and periodic reconciliation.
