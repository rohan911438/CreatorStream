import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { creatorsRouter } from './routes/creators.js';
import { royaltiesRouter } from './routes/royalties.js';
import { forteRouter } from './routes/forte.js';
import { flowRouter } from './routes/flow.js';

// Load env from server/.env if present, else from project .env
try {
  const serverEnvPath = path.resolve(process.cwd(), 'server', '.env');
  const rootEnvPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(serverEnvPath)) {
    dotenv.config({ path: serverEnvPath });
  } else if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  } else {
    dotenv.config();
  }
} catch {}

const app = express();
const PORT = process.env.PORT || 8787;
const DUNE_API_KEY = process.env.DUNE_API_KEY;
if (!DUNE_API_KEY) {
  console.warn('[Dune] Missing DUNE_API_KEY. Set it in server/.env');
}

app.use(cors());
app.use(express.json());
// Mount new modular routers
app.use('/api/creators', creatorsRouter);
app.use('/api/royalties', royaltiesRouter);
app.use('/api/forte', forteRouter);
app.use('/api/flow', flowRouter);

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

// -------------- Beezie AI Predictions via Google Gemini (proxy) --------------
// POST /api/beezie/predict { prompt: string, model?: string }
app.post('/api/beezie/predict', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });

    const { prompt, model } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const mdl = model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      return res.status(500).json({ error: 'Gemini request failed', detail: errText });
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text, raw: data });
  } catch (err) {
    console.error('[Beezie] Predict error', err);
    res.status(500).json({ error: 'Predict error', message: err?.message || String(err) });
  }
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

// ------------------ Static hosting for production ------------------
try {
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // SPA fallback to index.html for any non-API route
    app.get(/^(?!\/api\/).*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
} catch (e) {
  console.warn('[server] Static hosting disabled:', e?.message || String(e));
}

app.listen(PORT, () => {
  console.log(`[server] Flow API live on port ${PORT}`);
  console.log(`[server] Flow endpoints available at http://localhost:${PORT}/api/flow`);
});
