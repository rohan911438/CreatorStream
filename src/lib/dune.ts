import { useQuery } from "@tanstack/react-query";

export interface DuneRow {
  [key: string]: any;
}

export interface DuneResults {
  result?: {
    rows: DuneRow[];
    metadata?: any;
  };
  source?: 'cache' | 'network';
}

async function fetchDune(queryId: string, params?: Record<string, string | number>) {
  const search = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const resp = await fetch(`/api/dune/query/${encodeURIComponent(queryId)}/results${search}`);
  if (!resp.ok) {
    throw new Error(`Dune proxy error ${resp.status}`);
  }
  return (await resp.json()) as DuneResults;
}

export function useDuneQuery(queryId: string, params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['dune', queryId, params],
    queryFn: () => fetchDune(queryId, params),
    refetchInterval: 30 * 60 * 1000, // 30 minutes auto-refresh
    staleTime: 15 * 60 * 1000,
  });
}
