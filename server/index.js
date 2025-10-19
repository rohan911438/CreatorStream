import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

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

// ------------------ Off-chain Royalty Aggregation ------------------
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const OFFCHAIN_FILE = path.join(DATA_DIR, 'offchain-royalties.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(OFFCHAIN_FILE)) fs.writeFileSync(OFFCHAIN_FILE, JSON.stringify({ royalties: [] }, null, 2));

function readOffchain() {
  try {
    const raw = fs.readFileSync(OFFCHAIN_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { royalties: [] };
  }
}

function writeOffchain(data) {
  fs.writeFileSync(OFFCHAIN_FILE, JSON.stringify(data, null, 2));
}

// GET list of off-chain royalties
app.get('/api/offchain/royalties', (_req, res) => {
  const data = readOffchain();
  res.json(data);
});

// POST add an off-chain royalty record
// body: { id?, marketplace, nftId, amountUSD, txHash?, note?, dateISO }
app.post('/api/offchain/royalties', (req, res) => {
  const body = req.body || {};
  const required = ['marketplace', 'nftId', 'amountUSD'];
  for (const k of required) {
    if (!(k in body)) return res.status(400).json({ error: `Missing field: ${k}` });
  }
  const data = readOffchain();
  const record = {
    id: body.id || `off_${Date.now()}`,
    marketplace: body.marketplace,
    nftId: body.nftId,
    amountUSD: Number(body.amountUSD) || 0,
    txHash: body.txHash || null,
    note: body.note || null,
    dateISO: body.dateISO || new Date().toISOString(),
  };
  data.royalties.push(record);
  writeOffchain(data);
  res.json({ ok: true, record });
});

// Aggregate on-chain and off-chain royalties
app.get('/api/royalties/aggregate', async (_req, res) => {
  try {
    const data = readOffchain();
    const offChainUSD = data.royalties.reduce((sum, r) => sum + (Number(r.amountUSD) || 0), 0);
    // Optional: include on-chain via Dune by query id param (not required here)
    const totalUSD = offChainUSD; // Add onChainUSD when available
    res.json({ offChainUSD, onChainUSD: 0, totalUSD });
  } catch (err) {
    res.status(500).json({ error: 'Aggregation error', message: err?.message || String(err) });
  }
});

// Reconciliation endpoint: placeholder that could fetch from Dune and match against off-chain
app.post('/api/offchain/reconcile', async (_req, res) => {
  try {
    const data = readOffchain();
    // Here you would fetch on-chain and compare; we just return counts
    res.json({ ok: true, offChainCount: data.royalties.length, reconciledAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Reconcile error', message: err?.message || String(err) });
  }
});

// ------------------ Multi-Token Payout Support (mocked) ------------------
// POST /api/payouts { token: 'FLOW'|'USDC'|'FROTH', amountUSD, recipients: [{wallet, percentage}] }
app.post('/api/payouts', (req, res) => {
  const { token, amountUSD, recipients } = req.body || {};
  const supported = ['FLOW', 'USDC', 'FROTH'];
  if (!supported.includes(token)) return res.status(400).json({ error: 'Unsupported token' });
  if (typeof amountUSD !== 'number') return res.status(400).json({ error: 'amountUSD must be number' });
  if (!Array.isArray(recipients) || recipients.length === 0) return res.status(400).json({ error: 'recipients required' });
  const totalPct = recipients.reduce((s, r) => s + (Number(r.percentage) || 0), 0);
  if (Math.abs(totalPct - 100) > 0.01) return res.status(400).json({ error: 'Recipients must total 100%' });

  const jobId = `payout_${Date.now()}`;
  console.log(`[PAYOUT] Job ${jobId}: token=${token} amountUSD=${amountUSD} recipients=${recipients.length}`);
  // In production: call Flow Forte Actions here
  res.json({ ok: true, jobId, status: 'queued', token });
});

// Periodic sync (every 30 minutes)
setInterval(() => {
  fetch(`http://localhost:${PORT}/api/offchain/reconcile`).catch(() => {});
}, 30 * 60 * 1000);
