import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Activity, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    { id: "1", collection: "Azuki Collection", amount: "0.8 ETH", scheduledDate: "Jan 20, 2024", recipients: 3 },
    { id: "2", collection: "CloneX Series", amount: "1.5 ETH", scheduledDate: "Jan 22, 2024", recipients: 5 },
    { id: "3", collection: "Moonbirds #2345", amount: "0.4 ETH", scheduledDate: "Jan 25, 2024", recipients: 2 },
  ];

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
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Withdraw Pending Royalties</h3>
            <p className="text-muted-foreground mb-4">Transfer $3,421.50 to your wallet</p>
            <div className="text-primary group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Withdraw Now →
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 group hover:scale-105 transition-transform cursor-pointer">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Manage Royalty Splits</h3>
            <p className="text-muted-foreground mb-4">Configure collaborator payments</p>
            <div className="text-primary group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Configure Splits →
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
