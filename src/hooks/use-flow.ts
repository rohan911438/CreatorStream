// Flow Blockchain Hook
// React hook for interacting with Flow blockchain

import { useState, useCallback } from "react";
import { useDapperWallet } from "./use-dapper-wallet";
import {
  initializeTracker,
  recordRoyalty,
  createSplit,
  updateSplit,
  getRoyaltyRecords,
  getRoyaltySplits,
  getRoyaltiesByNFT,
  getSplitByNFT,
  hasTracker,
  type RoyaltyRecord,
  type RoyaltySplit,
} from "@/lib/flow-service";

export const useFlow = () => {
  const { address, isConnected } = useDapperWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize tracker
  const initialize = useCallback(async () => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const txId = await initializeTracker();
      return { success: true, txId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize tracker";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  // Record royalty payment
  const addRoyaltyRecord = useCallback(
    async (
      nftID: number,
      amount: number,
      recipient: string,
      marketplace: string,
      transactionHash: string
    ) => {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const txId = await recordRoyalty(nftID, amount, recipient, marketplace, transactionHash);
        return { success: true, txId };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to record royalty";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, address]
  );

  // Create royalty split
  const addSplit = useCallback(
    async (nftID: number, collaborators: string[], percentages: number[]) => {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const txId = await createSplit(nftID, collaborators, percentages);
        return { success: true, txId };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create split";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, address]
  );

  // Update royalty split
  const modifySplit = useCallback(
    async (splitID: number, collaborators: string[], percentages: number[]) => {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const txId = await updateSplit(splitID, collaborators, percentages);
        return { success: true, txId };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update split";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, address]
  );

  // Fetch royalty records
  const fetchRoyaltyRecords = useCallback(async (): Promise<RoyaltyRecord[]> => {
    if (!address) return [];

    setIsLoading(true);
    setError(null);

    try {
      const records = await getRoyaltyRecords(address);
      return records;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch records";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch royalty splits
  const fetchRoyaltySplits = useCallback(async (): Promise<RoyaltySplit[]> => {
    if (!address) return [];

    setIsLoading(true);
    setError(null);

    try {
      const splits = await getRoyaltySplits(address);
      return splits;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch splits";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch royalties for specific NFT
  const fetchNFTRoyalties = useCallback(
    async (nftID: number): Promise<RoyaltyRecord[]> => {
      if (!address) return [];

      setIsLoading(true);
      setError(null);

      try {
        const records = await getRoyaltiesByNFT(address, nftID);
        return records;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch NFT royalties";
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  // Fetch split for specific NFT
  const fetchNFTSplit = useCallback(
    async (nftID: number): Promise<RoyaltySplit | null> => {
      if (!address) return null;

      setIsLoading(true);
      setError(null);

      try {
        const split = await getSplitByNFT(address, nftID);
        return split;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch NFT split";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  // Check if tracker is initialized
  const checkTracker = useCallback(async (): Promise<boolean> => {
    if (!address) return false;

    setIsLoading(true);
    setError(null);

    try {
      const initialized = await hasTracker(address);
      return initialized;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check tracker";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    // State
    isLoading,
    error,
    address,
    isConnected,

    // Actions
    initialize,
    addRoyaltyRecord,
    addSplit,
    modifySplit,

    // Queries
    fetchRoyaltyRecords,
    fetchRoyaltySplits,
    fetchNFTRoyalties,
    fetchNFTSplit,
    checkTracker,
  };
};
