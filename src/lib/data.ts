// Shared types and mock data used across dashboard features

export type Marketplace = "NBA Top Shot" | "NFL All Day" | "Flowverse" | "OpenSea" | "Rarible";

export interface PayoutSchedule {
  id: string;
  collection: string;
  amountUSD: number;
  dateISO: string; // next payout date
  recipients: number;
}

export interface NFTItem {
  id: string;
  name: string; // e.g., Cosmic Dreams #1234
  collection: string;
}

export interface Earning {
  nftId: string;
  marketplace: Marketplace;
  amountUSD: number;
  dateISO: string;
}

export interface Collaborator {
  id: string;
  name: string;
  wallet: string;
  percentage: number;
  role?: string;
  totalEarnedUSD?: number;
}

export interface NotificationItem {
  id: string;
  type: "payout" | "sale" | "system";
  title: string;
  message: string;
  dateISO: string;
  read?: boolean;
}

// Mock data
export const mockPayouts: PayoutSchedule[] = [
  { id: "p1", collection: "Azuki Collection", amountUSD: 2150.0, dateISO: new Date(Date.now() + 2*86400000).toISOString(), recipients: 3 },
  { id: "p2", collection: "CloneX Series", amountUSD: 4020.25, dateISO: new Date(Date.now() + 5*86400000).toISOString(), recipients: 5 },
  { id: "p3", collection: "Moonbirds #2345", amountUSD: 1099.99, dateISO: new Date(Date.now() + 8*86400000).toISOString(), recipients: 2 },
];

export const mockNFTs: NFTItem[] = [
  { id: "n1", name: "Cosmic Dreams #1234", collection: "Cosmic Dreams" },
  { id: "n2", name: "Digital Waves #567", collection: "Digital Waves" },
  { id: "n3", name: "Abstract Minds #89", collection: "Abstract Minds" },
  { id: "n4", name: "Neon Nights #2345", collection: "Neon Nights" },
];

export const mockEarnings: Earning[] = [
  { nftId: "n1", marketplace: "NBA Top Shot", amountUSD: 234.5, dateISO: new Date().toISOString() },
  { nftId: "n2", marketplace: "NFL All Day", amountUSD: 189.25, dateISO: new Date().toISOString() },
  { nftId: "n3", marketplace: "Flowverse", amountUSD: 412.75, dateISO: new Date().toISOString() },
  { nftId: "n4", marketplace: "NBA Top Shot", amountUSD: 156.0, dateISO: new Date().toISOString() },
  { nftId: "n1", marketplace: "OpenSea", amountUSD: 98.5, dateISO: new Date().toISOString() },
  { nftId: "n2", marketplace: "Rarible", amountUSD: 521.0, dateISO: new Date().toISOString() },
];

export const mockCollaborators: Collaborator[] = [
  { id: "c1", name: "Sarah Johnson", wallet: "0x742d...Ab3f", percentage: 40, role: "Lead Artist", totalEarnedUSD: 9825.56 },
  { id: "c2", name: "Mike Chen", wallet: "0x8a2c...7e9d", percentage: 30, role: "Developer", totalEarnedUSD: 7369.17 },
  { id: "c3", name: "Alex Rivera", wallet: "0x5f1b...2c4a", percentage: 20, role: "Marketing", totalEarnedUSD: 4912.78 },
  { id: "c4", name: "You", wallet: "0x742d...Ab3f", percentage: 10, role: "Project Lead", totalEarnedUSD: 2456.39 },
];

export const mockNotifications: NotificationItem[] = [
  { id: "nt1", type: "payout", title: "Payout Executed", message: "$2,150.00 distributed to 3 collaborators (Azuki)", dateISO: new Date().toISOString(), read: false },
  { id: "nt2", type: "sale", title: "New Sale", message: "Cosmic Dreams #1234 sold for $234.50 on NBA Top Shot", dateISO: new Date().toISOString(), read: false },
  { id: "nt3", type: "system", title: "Uptime 99.9%", message: "All services operational.", dateISO: new Date().toISOString(), read: true },
];

// Helpers
export const formatUSD = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

export const nextPayout = () =>
  mockPayouts.slice().sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO))[0];
