import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Activity } from "lucide-react";

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Royalties Earned",
      value: "$24,563.89",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Pending Payouts",
      value: "$3,421.50",
      change: "3 pending",
      icon: Clock,
      trend: "neutral",
    },
    {
      title: "This Month",
      value: "$8,932.17",
      change: "+23.1%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Active Collections",
      value: "12",
      change: "+2 new",
      icon: Activity,
      trend: "up",
    },
  ];

  const recentTransactions = [
    { collection: "Cosmic Dreams #1234", amount: "$234.50", date: "2 hours ago", status: "Completed" },
    { collection: "Digital Waves #567", amount: "$189.25", date: "5 hours ago", status: "Completed" },
    { collection: "Abstract Minds #89", amount: "$412.75", date: "1 day ago", status: "Completed" },
    { collection: "Neon Nights #2345", amount: "$156.00", date: "1 day ago", status: "Pending" },
    { collection: "Pixel Art #678", amount: "$298.50", date: "2 days ago", status: "Completed" },
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'} mt-1`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
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
                <div className="text-right">
                  <div className="font-semibold text-lg">{tx.amount}</div>
                  <div className={`text-xs ${tx.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
