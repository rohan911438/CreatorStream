import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8787;
const DUNE_API_KEY = process.env.DUNE_API_KEY;
if (!DUNE_API_KEY) {
  console.warn('[Dune] Missing DUNE_API_KEY. Set it in server/.env');
}

app.use(cors());
app.use(express.json());

// Simple in-memory cache with TTL (30 minutes)
const cache = new Map();
const TTL_MS = 30 * 60 * 1000;

function setCache(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + TTL_MS });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Proxy Dune results endpoint without exposing the API key to the client
// GET /api/dune/query/:queryId/results?limit=1000
app.get('/api/dune/query/:queryId/results', async (req, res) => {
  try {
    const { queryId } = req.params;
    const search = new URLSearchParams(req.query).toString();
    const cacheKey = `${queryId}:${search}`;

    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({ source: 'cache', ...cached });
    }

    if (!DUNE_API_KEY) {
      return res.status(500).json({ error: 'DUNE_API_KEY not configured on server' });
    }

    const url = `https://api.dune.com/api/v1/query/${encodeURIComponent(queryId)}/results${search ? `?${search}` : ''}`;
    const resp = await fetch(url, {
      headers: {
        'X-DUNE-API-KEY': DUNE_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'Dune API error', status: resp.status, body: text });
    }

    const data = await resp.json();
    setCache(cacheKey, data);
    res.json({ source: 'network', ...data });
  } catch (err) {
    console.error('[Dune] Proxy error', err);
    res.status(500).json({ error: 'Proxy error', message: err?.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Dune proxy server running on http://localhost:${PORT}`);
});
