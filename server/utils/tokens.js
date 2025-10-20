export const SUPPORTED_TOKENS = ['FLOW', 'USDC', 'FROTH'];

// Placeholder fiat rates; in production fetch from an oracle or pricing API
const USD_RATES = {
  FLOW: 0.7, // 1 FLOW ~ $0.70 (example)
  USDC: 1.0,
  FROTH: 0.1,
};

export function toUSD(amount, token) {
  const rate = USD_RATES[token] ?? 1;
  return Number(amount) * rate;
}

export function fromUSD(usd, token) {
  const rate = USD_RATES[token] ?? 1;
  if (rate === 0) return 0;
  return Number(usd) / rate;
}

export function validateToken(token) {
  return SUPPORTED_TOKENS.includes(token);
}
