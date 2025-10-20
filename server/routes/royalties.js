import { Router } from 'express';
import { addRoyalty, listRoyaltiesByCreator, markRoyaltyPaid, aggregateUnpaidByCreator } from '../models/royalties.js';
import { validateToken } from '../utils/tokens.js';

export const royaltiesRouter = Router();

// GET /api/royalties/:creatorId
royaltiesRouter.get('/:creatorId', async (req, res) => {
  try {
    const items = await listRoyaltiesByCreator(req.params.creatorId);
    res.json({ royalties: items });
  } catch (e) {
    res.status(500).json({ error: 'royalties_fetch_failed', message: e.message });
  }
});

// POST /api/royalties { creator_id, nft_contract, nft_name?, sale_amount, royalty_percent, payout_token, marketplace, timestamp? }
royaltiesRouter.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const required = ['creator_id', 'nft_contract', 'sale_amount', 'royalty_percent', 'payout_token', 'marketplace'];
    for (const k of required) if (!(k in body)) return res.status(400).json({ error: `missing_${k}` });
    if (!validateToken(body.payout_token)) return res.status(400).json({ error: 'unsupported_token' });
    const created = await addRoyalty(body);
    res.json({ ok: true, royalty: created });
  } catch (e) {
    res.status(500).json({ error: 'royalty_add_failed', message: e.message });
  }
});

// PATCH /api/royalties/:id/paid -> mark as paid
royaltiesRouter.patch('/:id/paid', async (req, res) => {
  try {
    const updated = await markRoyaltyPaid(req.params.id);
    res.json({ ok: true, royalty: updated });
  } catch (e) {
    res.status(500).json({ error: 'mark_paid_failed', message: e.message });
  }
});

// GET /api/royalties/:creatorId/unpaid/aggregate
royaltiesRouter.get('/:creatorId/unpaid/aggregate', async (req, res) => {
  try {
    const aggregates = await aggregateUnpaidByCreator(req.params.creatorId);
    res.json({ creator: req.params.creatorId, aggregates });
  } catch (e) {
    res.status(500).json({ error: 'aggregate_failed', message: e.message });
  }
});
