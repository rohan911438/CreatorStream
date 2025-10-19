import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { store } from './store.js';

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
// GET list of off-chain royalties
app.get('/api/offchain/royalties', (_req, res) => {
  const royalties = store.listRoyalties();
  res.json({ royalties });
});

// POST add an off-chain royalty record
// body: { id?, marketplace, nftId, amountUSD, txHash?, note?, dateISO }
app.post('/api/offchain/royalties', (req, res) => {
  const body = req.body || {};
  const required = ['marketplace', 'nftId', 'amountUSD'];
  for (const k of required) {
    if (!(k in body)) return res.status(400).json({ error: `Missing field: ${k}` });
  }
  const record = {
    id: body.id || `off_${Date.now()}`,
    marketplace: body.marketplace,
    nftId: body.nftId,
    amountUSD: Number(body.amountUSD) || 0,
    txHash: body.txHash || null,
    note: body.note || null,
    dateISO: body.dateISO || new Date().toISOString(),
  };
  store.addRoyalty(record);
  res.json({ ok: true, record });
});

// Aggregate on-chain and off-chain royalties
app.get('/api/royalties/aggregate', async (_req, res) => {
  try {
    const royalties = store.listRoyalties();
    const offChainUSD = royalties.reduce((sum, r) => sum + (Number(r.amountUSD) || 0), 0);
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
    const royalties = store.listRoyalties();
    // Here you would fetch on-chain and compare; we just return counts
    res.json({ ok: true, offChainCount: royalties.length, reconciledAt: new Date().toISOString() });
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
  const job = { id: jobId, token, amountUSD, recipients, status: 'queued', createdAt: Date.now(), updatedAt: Date.now() };
  store.createPayout(job);
  console.log(`[PAYOUT] Job ${jobId}: token=${token} amountUSD=${amountUSD} recipients=${recipients.length}`);
  // In production: call Flow Forte Actions here
  res.json({ ok: true, jobId, status: job.status, token });
});

// Periodic sync (every 30 minutes)
setInterval(() => {
  fetch(`http://localhost:${PORT}/api/offchain/reconcile`).catch(() => {});
}, 30 * 60 * 1000);

// ------------------ Collaborators CRUD ------------------
app.get('/api/collaborators', (_req, res) => {
  res.json({ collaborators: store.listCollaborators() });
});

app.post('/api/collaborators', (req, res) => {
  const { name, wallet, percentage, role } = req.body || {};
  if (!name || !wallet) return res.status(400).json({ error: 'name and wallet required' });
  const c = { id: `col_${Date.now()}`, name, wallet, percentage: Number(percentage)||0, role: role||null, createdAt: Date.now() };
  store.addCollaborator(c);
  res.json({ ok: true, collaborator: c });
});

app.patch('/api/collaborators/:id', (req, res) => {
  const updated = store.updateCollaborator(req.params.id, req.body||{});
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true, collaborator: updated });
});

app.delete('/api/collaborators/:id', (req, res) => {
  const ok = store.deleteCollaborator(req.params.id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

// ------------------ Payout job status ------------------
app.get('/api/payouts', (_req, res) => {
  res.json({ payouts: store.listPayouts() });
});

app.get('/api/payouts/:id', (req, res) => {
  const p = store.getPayout(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json({ payout: p });
});

// Simple background processor that marks queued -> processing -> completed
setInterval(() => {
  const jobs = store.listPayouts(100);
  for (const j of jobs) {
    if (j.status === 'canceled' || j.status === 'completed' || j.status === 'failed') continue;
    if (j.status === 'queued' && Date.now() - j.createdAt > 2000) {
      store.updatePayout(j.id, { status: 'processing', updatedAt: Date.now() });
      console.log(`[PAYOUT] ${j.id} -> processing`);
    } else if (j.status === 'processing' && Date.now() - j.updatedAt > 3000) {
      store.updatePayout(j.id, { status: 'completed', updatedAt: Date.now() });
      console.log(`[PAYOUT] ${j.id} -> completed`);
    }
  }
}, 1500);

// Retry a payout job: set back to queued if not processing
app.patch('/api/payouts/:id/retry', (req, res) => {
  const p = store.getPayout(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  if (p.status === 'processing') return res.status(400).json({ error: 'cannot retry while processing' });
  const updated = store.updatePayout(p.id, { status: 'queued', updatedAt: Date.now(), createdAt: Date.now() });
  res.json({ ok: true, payout: updated });
});

// Cancel a payout job: mark canceled if queued or processing
app.patch('/api/payouts/:id/cancel', (req, res) => {
  const p = store.getPayout(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  if (p.status === 'completed' || p.status === 'failed' || p.status === 'canceled') {
    return res.status(400).json({ error: `cannot cancel status ${p.status}` });
  }
  const updated = store.updatePayout(p.id, { status: 'canceled', updatedAt: Date.now() });
  res.json({ ok: true, payout: updated });
});
