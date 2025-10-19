import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Clock, Activity, Calendar, Users, Trophy, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatUSD, nextPayout, mockPayouts } from "@/lib/data";
import { useOffchainRoyalties, useAddOffchainRoyalty } from "@/lib/royalties";
import { useState } from "react";
import { useCreatePayout } from "@/lib/royalties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Royalties Earned",
      value: "12.45 ETH",
      subtitle: "≈ $24,890 USD",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Pending Payouts",
      value: "2.7 ETH",
      subtitle: "3 scheduled",
      change: "Next payout in 2 days",
      icon: Clock,
      trend: "neutral",
    },
    {
      title: "This Month",
      value: "2.85 ETH",
      subtitle: "≈ $5,700 USD",
      change: "+23.1%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Active Collaborators",
      value: "12",
      subtitle: "Across 8 collections",
      change: "+2 new",
      icon: Users,
      trend: "up",
    },
  ];

  const recentTransactions = [
    { collection: "Cosmic Dreams #1234", amount: "0.5 ETH", date: "2 hours ago", status: "Completed" },
    { collection: "Digital Waves #567", amount: "0.35 ETH", date: "5 hours ago", status: "Completed" },
    { collection: "Abstract Minds #89", amount: "0.75 ETH", date: "1 day ago", status: "Completed" },
  ];

  const pendingPayouts = [
    ...mockPayouts.map(p => ({
      id: p.id,
      collection: p.collection,
      amount: formatUSD(p.amountUSD),
      scheduledDate: new Date(p.dateISO).toLocaleString(),
      recipients: p.recipients,
    })),
  ];

  const next = nextPayout();
  const { data: offchain, isLoading: loadingOff } = useOffchainRoyalties();
  const { mutateAsync: addOffchain, isPending: addingOff } = useAddOffchainRoyalty();
  const [token, setToken] = useState<'FLOW'|'USDC'|'FROTH'>('FLOW');
  const { mutateAsync: createPayout, isPending } = useCreatePayout();

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your royalties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border-border/50 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="bg-primary/10 p-2 rounded-lg">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'} mt-1`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Payout Banner */}
      {next && (
        <Card className="glass-card border-primary/40">
          <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Upcoming payout</div>
              <div className="text-xl md:text-2xl font-semibold">{next.collection}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
              <div className="font-mono">{new Date(next.dateISO).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-2xl font-bold gradient-text">{formatUSD(next.amountUSD)}</div>
            </div>
            <Badge variant="outline">{next.recipients} recipients</Badge>
          </CardContent>
        </Card>
      )}

      {/* Pending Payouts and Recent Transactions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Payouts Schedule */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Payouts
            </CardTitle>
            <CardDescription>Scheduled royalty distributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{payout.collection}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.recipients} recipient{payout.recipients > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold gradient-text">{payout.amount}</p>
                    <p className="text-xs text-muted-foreground">{payout.scheduledDate}</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest royalty payments received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border/30"
                >
                  <div className="flex-1">
                    <div className="font-medium">{tx.collection}</div>
                    <div className="text-sm text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold gradient-text">{tx.amount}</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border-border/50 group hover:scale-105 transition-transform cursor-pointer">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-lg font-semibold">Withdraw Pending Royalties</h3>
            <p className="text-muted-foreground">Choose payout token and distribute automatically</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Payout Token</div>
                <Select value={token} onValueChange={(v: any) => setToken(v)}>
                  <SelectTrigger className="glass-card border-border/50">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLOW">FLOW</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="FROTH">FROTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full"
                  variant="gradient"
                  disabled={isPending}
                  onClick={async () => {
                    try {
                      const amountUSD = 3421.5; // example pending amount; integrate real value later
                      const recipients = [
                        { wallet: "0x742d...Ab3f", percentage: 40 },
                        { wallet: "0x8a2c...7e9d", percentage: 30 },
                        { wallet: "0x5f1b...2c4a", percentage: 20 },
                        { wallet: "0x1234...abcd", percentage: 10 },
                      ];
                      const res = await createPayout({ token, amountUSD, recipients });
                      toast.success(`Payout queued (${res.token})`, { description: `Job ${res.jobId}` });
                    } catch (e: any) {
                      toast.error("Failed to create payout", { description: e?.message });
                    }
                  }}
                >
                  {isPending ? 'Queuing…' : 'Distribute Now →'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 group hover:scale-105 transition-transform cursor-pointer">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-lg font-semibold">Off-chain Royalty Aggregation</h3>
            <p className="text-muted-foreground">Track royalties from marketplaces without standardized fields.</p>
            <div className="text-sm text-muted-foreground">
              {loadingOff ? 'Loading…' : `${offchain?.royalties?.length ?? 0} records`}
            </div>
            <div>
              <Button
                size="sm"
                variant="glass"
                disabled={addingOff}
                onClick={async () => {
                  await addOffchain({ marketplace: 'CustomMarket', nftId: 'n-custom', amountUSD: 25.5, note: 'Manual sync' });
                  toast.success('Added off-chain royalty record');
                }}
              >
                {addingOff ? 'Adding…' : 'Add Sample Record'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gamified Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Total Royalties Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">{formatUSD(24563.9)}</div>
            <div className="text-xs text-muted-foreground mt-1">Lifetime</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-primary" /> Total Collaborators Helped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">37</div>
            <div className="text-xs text-muted-foreground mt-1">Across all collections</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
