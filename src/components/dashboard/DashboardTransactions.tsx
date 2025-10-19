import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportCSV, exportPDF } from "@/lib/export";
import { mockEarnings, mockNFTs, formatUSD } from "@/lib/data";

export function DashboardTransactions() {
  const transactions = [
    {
      id: "TX001",
      collection: "Cosmic Dreams #1234",
      type: "Secondary Sale",
      amount: "$234.50",
      date: "2024-01-15 14:23",
      status: "Completed",
      blockchain: "Ethereum",
    },
    {
      id: "TX002",
      collection: "Digital Waves #567",
      type: "Secondary Sale",
      amount: "$189.25",
      date: "2024-01-15 09:12",
      status: "Completed",
      blockchain: "Polygon",
    },
    {
      id: "TX003",
      collection: "Abstract Minds #89",
      type: "Resale",
      amount: "$412.75",
      date: "2024-01-14 18:45",
      status: "Completed",
      blockchain: "Ethereum",
    },
    {
      id: "TX004",
      collection: "Neon Nights #2345",
      type: "Secondary Sale",
      amount: "$156.00",
      date: "2024-01-14 11:30",
      status: "Pending",
      blockchain: "Ethereum",
    },
    {
      id: "TX005",
      collection: "Pixel Art #678",
      type: "Resale",
      amount: "$298.50",
      date: "2024-01-13 16:20",
      status: "Completed",
      blockchain: "Solana",
    },
    {
      id: "TX006",
      collection: "Abstract Minds #145",
      type: "Secondary Sale",
      amount: "$521.00",
      date: "2024-01-13 13:15",
      status: "Completed",
      blockchain: "Ethereum",
    },
    {
      id: "TX007",
      collection: "Cosmic Dreams #987",
      type: "Resale",
      amount: "$367.80",
      date: "2024-01-12 20:05",
      status: "Completed",
      blockchain: "Polygon",
    },
    {
      id: "TX008",
      collection: "Digital Waves #1122",
      type: "Secondary Sale",
      amount: "$445.25",
      date: "2024-01-12 14:50",
      status: "Failed",
      blockchain: "Ethereum",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Transaction History</h1>
        <p className="text-muted-foreground">Complete history of all your royalty transactions</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 glass-card border-border/50"
          />
        </div>
        <Button variant="glass" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="glass"
          className="gap-2"
          onClick={() => {
            const rows = mockEarnings.map(e => ({
              nft: mockNFTs.find(n => n.id === e.nftId)?.name,
              marketplace: e.marketplace,
              amountUSD: e.amountUSD,
              date: new Date(e.dateISO).toLocaleString(),
            }));
            exportCSV("royalties.csv", rows);
          }}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Transactions Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Collection</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Blockchain</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-border/30 hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">{tx.id}</td>
                    <td className="p-4">{tx.collection}</td>
                    <td className="p-4 text-sm text-muted-foreground">{tx.type}</td>
                    <td className="p-4 font-semibold">{tx.amount}</td>
                    <td className="p-4 text-sm text-muted-foreground">{tx.date}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-primary/30">
                        {tx.blockchain}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          tx.status === "Completed"
                            ? "default"
                            : tx.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* NFT Earnings Breakdown */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>NFT Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">NFT</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Marketplace</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockEarnings.map((e, idx) => (
                  <tr key={idx} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <td className="p-4">{mockNFTs.find(n => n.id === e.nftId)?.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{e.marketplace}</td>
                    <td className="p-4 font-semibold">{formatUSD(e.amountUSD)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(e.dateISO).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="glass"
              onClick={() => exportCSV("nft-earnings.csv", mockEarnings.map(e => ({
                nft: mockNFTs.find(n => n.id === e.nftId)?.name,
                marketplace: e.marketplace,
                amountUSD: e.amountUSD,
                date: new Date(e.dateISO).toLocaleString(),
              })))}
            >
              Export CSV
            </Button>
            <Button
              variant="glass"
              onClick={() => exportPDF("nft-earnings.pdf", "NFT Earnings Breakdown", mockEarnings.map(e => ({
                nft: mockNFTs.find(n => n.id === e.nftId)?.name,
                marketplace: e.marketplace,
                amountUSD: formatUSD(e.amountUSD),
                date: new Date(e.dateISO).toLocaleString(),
              })))}
            >
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Volume</div>
            <div className="text-2xl font-bold gradient-text">$2,625.05</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Completed</div>
            <div className="text-2xl font-bold text-green-500">6</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Pending</div>
            <div className="text-2xl font-bold text-yellow-500">1</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Failed</div>
            <div className="text-2xl font-bold text-red-500">1</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
