import { Router } from 'express';
import { aggregateUnpaidByCreator } from '../models/royalties.js';

export const forteRouter = Router();

// GET /api/forte/prepare/:creatorId?token=USDC
// Returns the shape required by the workflow example in the spec.
forteRouter.get('/prepare/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const token = (req.query.token || 'USDC').toString().toUpperCase();
    const agg = await aggregateUnpaidByCreator(creatorId);
    const pick = agg.find(a => a.token === token) || agg[0] || { token, total_unpaid: '0.00', pending_transactions: [] };
    res.json({
      creator: creatorId,
      total_unpaid: pick.total_unpaid,
      token: pick.token,
      pending_transactions: pick.pending_transactions,
    });
  } catch (e) {
    res.status(500).json({ error: 'forte_prepare_failed', message: e.message });
  }
});
