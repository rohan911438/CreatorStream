// Flow Blockchain Service
// Service layer for interacting with Flow blockchain via FCL

import { fcl } from "./flow-config";

// Contract addresses (update these with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  RoyaltyTracker: "0xf8d6e0586b0a20c7", // Emulator - DEPLOYED ✅
  // RoyaltyTracker: "0xYOUR_TESTNET_ADDRESS", // Testnet
  // RoyaltyTracker: "0xYOUR_MAINNET_ADDRESS", // Mainnet
};

// Transaction Templates
const TRANSACTIONS = {
  initializeTracker: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&RoyaltyTracker.Tracker>(from: RoyaltyTracker.RoyaltyTrackerStoragePath) == nil {
            let tracker <- RoyaltyTracker.createTracker()
            signer.storage.save(<-tracker, to: RoyaltyTracker.RoyaltyTrackerStoragePath)
            
            let cap = signer.capabilities.storage.issue<&RoyaltyTracker.Tracker>(
                RoyaltyTracker.RoyaltyTrackerStoragePath
            )
            signer.capabilities.publish(cap, at: RoyaltyTracker.RoyaltyTrackerPublicPath)
        }
    }
    execute {
        log("RoyaltyTracker initialized successfully")
    }
}
  `,

  recordRoyalty: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

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
  `,

  createSplit: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

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
  `,

  updateSplit: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

transaction(splitID: UInt64, collaborators: [Address], percentages: [UFix64]) {
    let trackerRef: &RoyaltyTracker.Tracker
    
    prepare(signer: auth(Storage) &Account) {
        self.trackerRef = signer.storage.borrow<&RoyaltyTracker.Tracker>(
            from: RoyaltyTracker.RoyaltyTrackerStoragePath
        ) ?? panic("Could not borrow tracker reference")
    }
    
    execute {
        self.trackerRef.updateSplit(
            splitID: splitID,
            collaborators: collaborators,
            percentages: percentages
        )
        log("Royalty split updated: ".concat(splitID.toString()))
    }
}
  `,
};

// Script Templates
const SCRIPTS = {
  getRoyaltyRecords: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

access(all) fun main(address: Address): [RoyaltyTracker.RoyaltyRecord] {
    let account = getAccount(address)
    let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
        RoyaltyTracker.RoyaltyTrackerPublicPath
    )
    let trackerRef = trackerCap.borrow()
        ?? panic("Could not borrow tracker reference")
    return trackerRef.getRoyaltyRecords()
}
  `,

  getRoyaltySplits: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

access(all) fun main(address: Address): [RoyaltyTracker.RoyaltySplit] {
    let account = getAccount(address)
    let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
        RoyaltyTracker.RoyaltyTrackerPublicPath
    )
    let trackerRef = trackerCap.borrow()
        ?? panic("Could not borrow tracker reference")
    return trackerRef.getRoyaltySplits()
}
  `,

  getRoyaltiesByNFT: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

access(all) fun main(address: Address, nftID: UInt64): [RoyaltyTracker.RoyaltyRecord] {
    let account = getAccount(address)
    let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
        RoyaltyTracker.RoyaltyTrackerPublicPath
    )
    let trackerRef = trackerCap.borrow()
        ?? panic("Could not borrow tracker reference")
    return trackerRef.getRoyaltiesByNFT(nftID: nftID)
}
  `,

  getSplitByNFT: `
import RoyaltyTracker from ${CONTRACT_ADDRESSES.RoyaltyTracker}

access(all) fun main(address: Address, nftID: UInt64): RoyaltyTracker.RoyaltySplit? {
    let account = getAccount(address)
    let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
        RoyaltyTracker.RoyaltyTrackerPublicPath
    )
    let trackerRef = trackerCap.borrow()
        ?? panic("Could not borrow tracker reference")
    return trackerRef.getSplitByNFTID(nftID: nftID)
}
  `,
};

// TypeScript Interfaces
export interface RoyaltyRecord {
  id: number;
  nftID: number;
  amount: string;
  recipient: string;
  marketplace: string;
  timestamp: string;
  transactionHash: string;
}

export interface RoyaltySplit {
  id: number;
  nftID: number;
  collaborators: string[];
  percentages: number[];
  createdAt: string;
  updatedAt: string;
}

// Service Functions

/**
 * Initialize the RoyaltyTracker for the current user
 */
export const initializeTracker = async (): Promise<string> => {
  try {
    const txId = await fcl.mutate({
      cadence: TRANSACTIONS.initializeTracker,
      limit: 100,
    });

    await fcl.tx(txId).onceSealed();
    return txId;
  } catch (error) {
    console.error("Error initializing tracker:", error);
    throw error;
  }
};

/**
 * Record a new royalty payment
 */
export const recordRoyalty = async (
  nftID: number,
  amount: number,
  recipient: string,
  marketplace: string,
  transactionHash: string
): Promise<string> => {
  try {
    const txId = await fcl.mutate({
      cadence: TRANSACTIONS.recordRoyalty,
      args: (arg, t) => [
        arg(nftID.toString(), t.UInt64),
        arg(amount.toFixed(8), t.UFix64),
        arg(recipient, t.Address),
        arg(marketplace, t.String),
        arg(transactionHash, t.String),
      ],
      limit: 100,
    });

    await fcl.tx(txId).onceSealed();
    return txId;
  } catch (error) {
    console.error("Error recording royalty:", error);
    throw error;
  }
};

/**
 * Create a new royalty split
 */
export const createSplit = async (
  nftID: number,
  collaborators: string[],
  percentages: number[]
): Promise<string> => {
  try {
    // Validate percentages sum to 100
    const total = percentages.reduce((sum, p) => sum + p, 0);
    if (Math.abs(total - 100) > 0.01) {
      throw new Error("Percentages must sum to 100");
    }

    const txId = await fcl.mutate({
      cadence: TRANSACTIONS.createSplit,
      args: (arg, t) => [
        arg(nftID.toString(), t.UInt64),
        arg(collaborators, t.Array(t.Address)),
        arg(percentages.map(p => p.toFixed(2)), t.Array(t.UFix64)),
      ],
      limit: 100,
    });

    await fcl.tx(txId).onceSealed();
    return txId;
  } catch (error) {
    console.error("Error creating split:", error);
    throw error;
  }
};

/**
 * Update an existing royalty split
 */
export const updateSplit = async (
  splitID: number,
  collaborators: string[],
  percentages: number[]
): Promise<string> => {
  try {
    // Validate percentages sum to 100
    const total = percentages.reduce((sum, p) => sum + p, 0);
    if (Math.abs(total - 100) > 0.01) {
      throw new Error("Percentages must sum to 100");
    }

    const txId = await fcl.mutate({
      cadence: TRANSACTIONS.updateSplit,
      args: (arg, t) => [
        arg(splitID.toString(), t.UInt64),
        arg(collaborators, t.Array(t.Address)),
        arg(percentages.map(p => p.toFixed(2)), t.Array(t.UFix64)),
      ],
      limit: 100,
    });

    await fcl.tx(txId).onceSealed();
    return txId;
  } catch (error) {
    console.error("Error updating split:", error);
    throw error;
  }
};

/**
 * Get all royalty records for an address
 */
export const getRoyaltyRecords = async (
  address: string
): Promise<RoyaltyRecord[]> => {
  try {
    const records = await fcl.query({
      cadence: SCRIPTS.getRoyaltyRecords,
      args: (arg, t) => [arg(address, t.Address)],
    });

    return records || [];
  } catch (error) {
    console.error("Error fetching royalty records:", error);
    return [];
  }
};

/**
 * Get all royalty splits for an address
 */
export const getRoyaltySplits = async (
  address: string
): Promise<RoyaltySplit[]> => {
  try {
    const splits = await fcl.query({
      cadence: SCRIPTS.getRoyaltySplits,
      args: (arg, t) => [arg(address, t.Address)],
    });

    return splits || [];
  } catch (error) {
    console.error("Error fetching royalty splits:", error);
    return [];
  }
};

/**
 * Get royalty records for a specific NFT
 */
export const getRoyaltiesByNFT = async (
  address: string,
  nftID: number
): Promise<RoyaltyRecord[]> => {
  try {
    const records = await fcl.query({
      cadence: SCRIPTS.getRoyaltiesByNFT,
      args: (arg, t) => [arg(address, t.Address), arg(nftID.toString(), t.UInt64)],
    });

    return records || [];
  } catch (error) {
    console.error("Error fetching NFT royalties:", error);
    return [];
  }
};

/**
 * Get royalty split for a specific NFT
 */
export const getSplitByNFT = async (
  address: string,
  nftID: number
): Promise<RoyaltySplit | null> => {
  try {
    const split = await fcl.query({
      cadence: SCRIPTS.getSplitByNFT,
      args: (arg, t) => [arg(address, t.Address), arg(nftID.toString(), t.UInt64)],
    });

    return split;
  } catch (error) {
    console.error("Error fetching NFT split:", error);
    return null;
  }
};

/**
 * Check if user has initialized the tracker
 */
export const hasTracker = async (address: string): Promise<boolean> => {
  try {
    await getRoyaltyRecords(address);
    return true;
  } catch (error) {
    return false;
  }
};
