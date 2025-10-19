import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={earningsData}>
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
