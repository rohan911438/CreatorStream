// Flow Blockchain API Routes
// Integration with Flow smart contract for creator royalty tracking

import { Router } from 'express';
import * as fcl from '@onflow/fcl';
import * as types from '@onflow/types';

export const flowRouter = Router();

// Configure FCL with environment variables
const FLOW_ACCESS_NODE = process.env.FLOW_ACCESS_NODE || 'http://127.0.0.1:8888';
const CONTRACT_ADDRESS = process.env.FLOW_CONTRACT_ADDRESS || '0xf8d6e0586b0a20c7';

fcl.config({
  'accessNode.api': FLOW_ACCESS_NODE,
});

console.log('[Flow] Configured with:', { 
  accessNode: FLOW_ACCESS_NODE, 
  contract: CONTRACT_ADDRESS 
});

// Helper function to execute Cadence scripts
async function executeScript(code, args = []) {
  try {
    const result = await fcl.query({
      cadence: code,
      args: (arg, t) => args.map(({ value, type }) => arg(value, type)),
    });
    return result;
  } catch (error) {
    console.error('[Flow Script Error]:', error);
    throw error;
  }
}

// Helper function to send transactions
async function sendTransaction(code, args = [], signers = []) {
  try {
    const txId = await fcl.mutate({
      cadence: code,
      args: (arg, t) => args.map(({ value, type }) => arg(value, type)),
      limit: 100,
    });
    
    // Wait for transaction to be sealed
    const transaction = await fcl.tx(txId).onceSealed();
    return { txId, transaction };
  } catch (error) {
    console.error('[Flow Transaction Error]:', error);
    throw error;
  }
}

// ============================================
// GET /api/flow/royalties/:address
// Fetch all royalty records for a Flow address
// ============================================
flowRouter.get('/royalties/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate address format
    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({ 
        error: 'Invalid Flow address format. Must start with 0x' 
      });
    }

    // Cadence script to get royalty records
    const script = `
      import RoyaltyTracker from ${CONTRACT_ADDRESS}

      access(all) fun main(address: Address): [RoyaltyTracker.RoyaltyRecord] {
          let account = getAccount(address)
          let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
              RoyaltyTracker.RoyaltyTrackerPublicPath
          )
          let trackerRef = trackerCap.borrow()
              ?? panic("Could not borrow tracker reference")
          return trackerRef.getRoyaltyRecords()
      }
    `;

    const records = await executeScript(script, [
      { value: address, type: types.Address }
    ]);

    res.json({
      success: true,
      address,
      count: records?.length || 0,
      records: records || []
    });

  } catch (error) {
    console.error('[GET /api/flow/royalties/:address] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch royalty records',
      message: error.message
    });
  }
});

// ============================================
// POST /api/flow/royalties
// Record a new royalty event on-chain
// Body: { nftID, amount, recipient, marketplace, transactionHash }
// ============================================
flowRouter.post('/royalties', async (req, res) => {
  try {
    const { nftID, amount, recipient, marketplace, transactionHash } = req.body;

    // Validate required fields
    if (!nftID || !amount || !recipient || !marketplace || !transactionHash) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['nftID', 'amount', 'recipient', 'marketplace', 'transactionHash']
      });
    }

    // Cadence transaction to record royalty
    const transaction = `
      import RoyaltyTracker from ${CONTRACT_ADDRESS}

      transaction(nftID: UInt64, amount: UFix64, recipient: Address, marketplace: String, transactionHash: String) {
          let trackerRef: &RoyaltyTracker.Tracker
          
          prepare(signer: auth(Storage) &Account) {
              self.trackerRef = signer.storage.borrow<&RoyaltyTracker.Tracker>(
                  from: RoyaltyTracker.RoyaltyTrackerStoragePath
              ) ?? panic("Could not borrow tracker reference")
          }
          
          execute {
              let recordID = self.trackerRef.recordRoyalty(
                  nftID: nftID,
                  amount: amount,
                  recipient: recipient,
                  marketplace: marketplace,
                  transactionHash: transactionHash
              )
              log("Royalty recorded with ID: ".concat(recordID.toString()))
          }
      }
    `;

    const args = [
      { value: nftID.toString(), type: types.UInt64 },
      { value: parseFloat(amount).toFixed(8), type: types.UFix64 },
      { value: recipient, type: types.Address },
      { value: marketplace, type: types.String },
      { value: transactionHash, type: types.String }
    ];

    const result = await sendTransaction(transaction, args);

    res.json({
      success: true,
      message: 'Royalty recorded successfully',
      transactionId: result.txId,
      data: { nftID, amount, recipient, marketplace }
    });

  } catch (error) {
    console.error('[POST /api/flow/royalties] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record royalty',
      message: error.message
    });
  }
});

// ============================================
// GET /api/flow/splits/:address
// Get all royalty splits for a given creator
// ============================================
flowRouter.get('/splits/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Validate address format
    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({ 
        error: 'Invalid Flow address format. Must start with 0x' 
      });
    }

    // Cadence script to get royalty splits
    const script = `
      import RoyaltyTracker from ${CONTRACT_ADDRESS}

      access(all) fun main(address: Address): [RoyaltyTracker.RoyaltySplit] {
          let account = getAccount(address)
          let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
              RoyaltyTracker.RoyaltyTrackerPublicPath
          )
          let trackerRef = trackerCap.borrow()
              ?? panic("Could not borrow tracker reference")
          return trackerRef.getRoyaltySplits()
      }
    `;

    const splits = await executeScript(script, [
      { value: address, type: types.Address }
    ]);

    res.json({
      success: true,
      address,
      count: splits?.length || 0,
      splits: splits || []
    });

  } catch (error) {
    console.error('[GET /api/flow/splits/:address] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch royalty splits',
      message: error.message
    });
  }
});

// ============================================
// POST /api/flow/splits
// Create a new split by sending a transaction
// Body: { nftID, collaborators, percentages }
// ============================================
flowRouter.post('/splits', async (req, res) => {
  try {
    const { nftID, collaborators, percentages } = req.body;

    // Validate required fields
    if (!nftID || !collaborators || !percentages) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['nftID', 'collaborators', 'percentages']
      });
    }

    // Validate arrays have same length
    if (collaborators.length !== percentages.length) {
      return res.status(400).json({
        error: 'Collaborators and percentages arrays must have the same length'
      });
    }

    // Validate percentages sum to 100
    const total = percentages.reduce((sum, p) => sum + parseFloat(p), 0);
    if (Math.abs(total - 100) > 0.01) {
      return res.status(400).json({
        error: 'Percentages must sum to 100',
        current: total
      });
    }

    // Cadence transaction to create split
    const transaction = `
      import RoyaltyTracker from ${CONTRACT_ADDRESS}

      transaction(nftID: UInt64, collaborators: [Address], percentages: [UFix64]) {
          let trackerRef: &RoyaltyTracker.Tracker
          
          prepare(signer: auth(Storage) &Account) {
              self.trackerRef = signer.storage.borrow<&RoyaltyTracker.Tracker>(
                  from: RoyaltyTracker.RoyaltyTrackerStoragePath
              ) ?? panic("Could not borrow tracker reference")
          }
          
          execute {
              let splitID = self.trackerRef.createSplit(
                  nftID: nftID,
                  collaborators: collaborators,
                  percentages: percentages
              )
              log("Royalty split created with ID: ".concat(splitID.toString()))
          }
      }
    `;

    const args = [
      { value: nftID.toString(), type: types.UInt64 },
      { value: collaborators, type: types.Array(types.Address) },
      { value: percentages.map(p => parseFloat(p).toFixed(2)), type: types.Array(types.UFix64) }
    ];

    const result = await sendTransaction(transaction, args);

    res.json({
      success: true,
      message: 'Royalty split created successfully',
      transactionId: result.txId,
      data: { nftID, collaborators, percentages }
    });

  } catch (error) {
    console.error('[POST /api/flow/splits] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create split',
      message: error.message
    });
  }
});

// ============================================
// GET /api/flow/analytics
// Fetch royalty analytics using Dune API
// ============================================
flowRouter.get('/analytics', async (req, res) => {
  try {
    const DUNE_API_KEY = process.env.DUNE_API_KEY;
    
    if (!DUNE_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Dune API key not configured',
        message: 'Set DUNE_API_KEY in environment variables'
      });
    }

    // Example: Fetch from Dune Analytics
    // Replace with your actual Dune query ID
    const DUNE_QUERY_ID = 'your-query-id'; // Update this with your Dune query
    const duneUrl = `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results`;

    const response = await fetch(duneUrl, {
      headers: {
        'X-Dune-API-Key': DUNE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Dune API error: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      source: 'Dune Analytics',
      data: data.result?.rows || []
    });

  } catch (error) {
    console.error('[GET /api/flow/analytics] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// ============================================
// GET /api/flow/offchain-feed
// Fetch fallback royalty data from off-chain aggregator
// ============================================
flowRouter.get('/offchain-feed', async (req, res) => {
  try {
    // Mock off-chain aggregator data
    // In production, this would call a real aggregator API
    const mockData = {
      lastUpdated: new Date().toISOString(),
      totalRoyalties: 1250.75,
      topMarketplaces: [
        { name: 'NBA Top Shot', volume: 750.50, transactions: 45 },
        { name: 'NFL All Day', volume: 300.25, transactions: 22 },
        { name: 'Breezy Drop', volume: 200.00, transactions: 18 }
      ],
      recentTransactions: [
        {
          marketplace: 'NBA Top Shot',
          nftID: '12345',
          amount: 15.50,
          timestamp: new Date().toISOString()
        }
      ]
    };

    res.json({
      success: true,
      source: 'Off-chain Aggregator',
      data: mockData
    });

  } catch (error) {
    console.error('[GET /api/flow/offchain-feed] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch off-chain data',
      message: error.message
    });
  }
});

// ============================================
// GET /api/flow/health
// Health check endpoint for Flow connection
// ============================================
flowRouter.get('/health', async (req, res) => {
  try {
    // Test connection by getting latest block
    const latestBlock = await fcl.send([fcl.getBlock(true)]).then(fcl.decode);
    
    res.json({
      success: true,
      status: 'healthy',
      flow: {
        connected: true,
        accessNode: FLOW_ACCESS_NODE,
        contractAddress: CONTRACT_ADDRESS,
        latestBlockHeight: latestBlock.height
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Failed to connect to Flow network',
      message: error.message
    });
  }
});
