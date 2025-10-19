import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type OffchainRoyalty = {
  id: string;
  marketplace: string;
  nftId: string;
  amountUSD: number;
  txHash?: string | null;
  note?: string | null;
  dateISO: string;
};

export function useOffchainRoyalties() {
  return useQuery({
    queryKey: ['offchain-royalties'],
    queryFn: async () => {
      const resp = await fetch('/api/offchain/royalties');
      if (!resp.ok) throw new Error('Failed to load off-chain royalties');
      return (await resp.json()) as { royalties: OffchainRoyalty[] };
    },
    refetchInterval: 30 * 60 * 1000,
  });
}

export function useAddOffchainRoyalty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<OffchainRoyalty>) => {
      const resp = await fetch('/api/offchain/royalties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error('Failed to add off-chain royalty');
      return resp.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offchain-royalties'] });
    }
  });
}

export function useAggregateRoyalties() {
  return useQuery({
    queryKey: ['royalties-aggregate'],
    queryFn: async () => {
      const resp = await fetch('/api/royalties/aggregate');
      if (!resp.ok) throw new Error('Failed to aggregate royalties');
      return resp.json() as Promise<{ offChainUSD: number; onChainUSD: number; totalUSD: number }>; 
    },
    refetchInterval: 30 * 60 * 1000,
  });
}

export function useReconcile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const resp = await fetch('/api/offchain/reconcile', { method: 'POST' });
      if (!resp.ok) throw new Error('Failed to reconcile');
      return resp.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['royalties-aggregate'] });
    },
  });
}

export function useCreatePayout() {
  return useMutation({
    mutationFn: async (body: { token: 'FLOW' | 'USDC' | 'FROTH'; amountUSD: number; recipients: { wallet: string; percentage: number }[] }) => {
      const resp = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error('Failed to create payout');
      return resp.json() as Promise<{ ok: boolean; jobId: string; status: string; token: string }>;
    },
  });
}
