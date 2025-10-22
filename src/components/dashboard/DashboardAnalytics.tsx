import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockEarnings, mockNFTs } from "@/lib/data";
import { useDuneQuery } from "@/lib/dune";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";

export function DashboardAnalytics() {
  const earningsData = [
    { month: "Jan", earnings: 4200, volume: 12 },
    { month: "Feb", earnings: 5100, volume: 15 },
    { month: "Mar", earnings: 4800, volume: 14 },
    { month: "Apr", earnings: 6200, volume: 18 },
    { month: "May", earnings: 7500, volume: 22 },
    { month: "Jun", earnings: 8900, volume: 26 },
  ];

  const collectionData = [
    { name: "Cosmic Dreams", earnings: 8500, percentage: 35 },
    { name: "Digital Waves", earnings: 6200, percentage: 25 },
    { name: "Abstract Minds", earnings: 4800, percentage: 20 },
    { name: "Neon Nights", earnings: 3100, percentage: 13 },
    { name: "Others", earnings: 1900, percentage: 7 },
  ];

  // Aggregate by marketplace from mockEarnings
  const marketplaceMap = new Map<string, number>();
  mockEarnings.forEach(e => marketplaceMap.set(e.marketplace, (marketplaceMap.get(e.marketplace) ?? 0) + e.amountUSD));
  const marketplaceData = Array.from(marketplaceMap.entries()).map(([name, earnings]) => ({ name, earnings }));

  // Top NFTs by earnings
  const nftMap = new Map<string, number>();
  mockEarnings.forEach(e => nftMap.set(e.nftId, (nftMap.get(e.nftId) ?? 0) + e.amountUSD));
  const topNfts = Array.from(nftMap.entries())
    .map(([nftId, earnings]) => ({ name: mockNFTs.find(n => n.id === nftId)?.name ?? nftId, earnings }))
    .sort((a,b) => b.earnings - a.earnings)
    .slice(0, 5);

  // Example Dune query IDs (replace with real IDs)
  const DUNE_EARNINGS_OVER_TIME = "123456";
  const DUNE_MARKETPLACE_DISTRIBUTION = "234567";
  const DUNE_TOP_NFTS = "345678";

  const {
    data: duneEarnings,
    isLoading: loadingEarnings,
    isError: errorEarnings,
  } = useDuneQuery(DUNE_EARNINGS_OVER_TIME, { limit: 1000 });

  const {
    data: duneMarkets,
    isLoading: loadingMarkets,
    isError: errorMarkets,
  } = useDuneQuery(DUNE_MARKETPLACE_DISTRIBUTION, { limit: 1000 });

  const {
    data: duneTopNfts,
    isLoading: loadingTopNfts,
    isError: errorTopNfts,
  } = useDuneQuery(DUNE_TOP_NFTS, { limit: 100 });

  // Transform Dune results if available, else use mock fallback
  const duneEarningsRows = duneEarnings?.result?.rows ?? [];
  const earningsDataLive = duneEarningsRows.length
    ? duneEarningsRows.map((r: any) => ({ month: r.month ?? r.time ?? r.date, earnings: Number(r.earnings ?? r.total ?? 0) }))
    : earningsData;

  const duneMarketRows = duneMarkets?.result?.rows ?? [];
  const marketplaceDataLive = duneMarketRows.length
    ? duneMarketRows.map((r: any) => ({ name: r.marketplace ?? r.name, earnings: Number(r.earnings ?? r.total ?? 0) }))
    : undefined;

  const duneTopNftRows = duneTopNfts?.result?.rows ?? [];
  const topNftsLive = duneTopNftRows.length
    ? duneTopNftRows.map((r: any) => ({ name: r.nft_name ?? r.name ?? r.nftId, earnings: Number(r.earnings ?? r.total ?? 0) }))
    : undefined;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your royalty earnings</p>
      </div>

      {/* Earnings Over Time */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEarnings ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={earningsDataLive}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(263 70% 50%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(263 70% 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="hsl(263 70% 50%)" 
                fillOpacity={1} 
                fill="url(#colorEarnings)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
          {errorEarnings && (
            <div className="text-xs text-red-500 mt-2">Failed to load live data. Showing fallback.</div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Collection Performance */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Top Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="earnings" fill="hsl(280 60% 60%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction Volume */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(330 80% 60%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(330 80% 60%)', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Flow Blockchain Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Flow Network Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div>
                  <p className="text-xs text-muted-foreground">Contract Address</p>
                  <p className="text-sm font-mono text-foreground/90 mt-1">0xf8d6e0586b0a20c7</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground">Network</p>
                  <p className="text-lg font-bold text-foreground mt-1">Flow Emulator</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-green-500 mt-1">● Active</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                <p className="text-xs text-muted-foreground">Total Royalties Tracked</p>
                <p className="text-2xl font-bold text-foreground mt-1">${marketplaceData.reduce((sum, m) => sum + m.earnings, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Top Collections Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collectionData.slice(0, 4).map((collection, idx) => (
                <div key={collection.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-blue-400 to-purple-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{collection.name}</p>
                      <p className="text-xs text-muted-foreground">{collection.percentage}% share</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${collection.earnings.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Recent Blockchain Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-green-500">✓ Royalty Recorded</p>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>
                <p className="text-sm text-foreground/90">$1,250.00 from NBA Top Shot</p>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-blue-500">⚡ Split Created</p>
                  <p className="text-xs text-muted-foreground">15 min ago</p>
                </div>
                <p className="text-sm text-foreground/90">3 collaborators • Digital Waves</p>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-purple-500">✓ Royalty Recorded</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <p className="text-sm text-foreground/90">$890.00 from Cosmic Dreams</p>
              </div>
              
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-orange-500">🔄 Tracker Initialized</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
                <p className="text-sm text-foreground/90">New creator onboarded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Contributions */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Marketplace Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMarkets ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketplaceDataLive ?? marketplaceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="earnings" fill="hsl(330 80% 60%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          )}
          {errorMarkets && (
            <div className="text-xs text-red-500 mt-2">Failed to load live data. Showing fallback.</div>
          )}
        </CardContent>
      </Card>

      {/* Top Performing NFTs */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Top Performing NFTs</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopNfts ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topNftsLive ?? topNfts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="earnings" fill="hsl(280 60% 60%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          )}
          {errorTopNfts && (
            <div className="text-xs text-red-500 mt-2">Failed to load live data. Showing fallback.</div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Average Royalty</div>
            <div className="text-3xl font-bold gradient-text">$187.32</div>
            <div className="text-xs text-green-500 mt-2">+15.3% vs last month</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Transactions</div>
            <div className="text-3xl font-bold gradient-text">347</div>
            <div className="text-xs text-green-500 mt-2">+28 this month</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Success Rate</div>
            <div className="text-3xl font-bold gradient-text">99.2%</div>
            <div className="text-xs text-green-500 mt-2">Excellent performance</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
