import { Router } from 'express';
import { getCreatorByWallet, listCreators, upsertCreator } from '../models/creators.js';

export const creatorsRouter = Router();

// GET /api/creators?limit=50
creatorsRouter.get('/', async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const data = await listCreators(limit);
    res.json({ creators: data });
  } catch (e) {
    res.status(500).json({ error: 'creators_list_failed', message: e.message });
  }
});

// GET /api/creators/by-wallet/:wallet
creatorsRouter.get('/by-wallet/:wallet', async (req, res) => {
  try {
    const data = await getCreatorByWallet(req.params.wallet);
    if (!data) return res.status(404).json({ error: 'not_found' });
    res.json({ creator: data });
  } catch (e) {
    res.status(500).json({ error: 'creator_lookup_failed', message: e.message });
  }
});

// POST /api/creators { wallet_address, name, preferred_token }
creatorsRouter.post('/', async (req, res) => {
  try {
    const { id, wallet_address, name, preferred_token } = req.body || {};
    if (!wallet_address) return res.status(400).json({ error: 'wallet_address_required' });
    const created = await upsertCreator({ id, wallet_address, name, preferred_token });
    res.json({ ok: true, creator: created });
  } catch (e) {
    res.status(500).json({ error: 'creator_upsert_failed', message: e.message });
  }
});
