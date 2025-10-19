import { useMutation } from "@tanstack/react-query";

export type BeezieRequest = {
  prompt: string;
  model?: string; // default: gemini-1.5-flash
};

export type BeezieResponse = {
  text: string;
  raw?: unknown;
  error?: string;
};

export async function beeziePredict(req: BeezieRequest): Promise<BeezieResponse> {
  const r = await fetch('/api/beezie/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!r.ok) {
    let detail = '';
    try { detail = await r.text(); } catch {}
    throw new Error(`Predict failed: ${r.status} ${detail}`);
  }
  return r.json();
}

export function useBeeziePredict() {
  return useMutation({
    mutationKey: ['beezie-predict'],
    mutationFn: beeziePredict,
  });
}
