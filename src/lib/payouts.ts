import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type PayoutJob = {
  id: string;
  token: 'FLOW'|'USDC'|'FROTH';
  amountUSD: number;
  recipients: { wallet: string; percentage: number }[];
  status: 'queued'|'processing'|'completed'|'failed'|'canceled';
  createdAt: number;
  updatedAt: number;
};

export function usePayouts() {
  return useQuery({
    queryKey: ['payouts'],
    queryFn: async () => {
      const resp = await fetch('/api/payouts');
      if (!resp.ok) throw new Error('Failed to load payouts');
      return (await resp.json()) as { payouts: PayoutJob[] };
    },
    refetchInterval: 3000,
  });
}

export function useRetryPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await fetch(`/api/payouts/${id}/retry`, { method: 'PATCH' });
      if (!resp.ok) throw new Error('Failed to retry payout');
      return resp.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
  });
}

export function useCancelPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await fetch(`/api/payouts/${id}/cancel`, { method: 'PATCH' });
      if (!resp.ok) throw new Error('Failed to cancel payout');
      return resp.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
  });
}
