Server for Dune API Proxy

Setup:
- Copy .env.example to .env and set DUNE_API_KEY.
- Run the server: npm run server (script added in package.json).

Endpoints:
- GET /api/health
- GET /api/dune/query/:queryId/results?limit=1000

Notes:
- Uses in-memory caching with 30 min TTL.
- Never expose DUNE_API_KEY in frontend; only set it in server/.env or env vars.
