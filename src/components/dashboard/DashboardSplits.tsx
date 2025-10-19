import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardSplits() {
  const collaborators = [
    {
      id: 1,
      name: "Sarah Johnson",
      wallet: "0x742d...Ab3f",
      percentage: 40,
      totalEarned: "$9,825.56",
      role: "Lead Artist",
    },
    {
      id: 2,
      name: "Mike Chen",
      wallet: "0x8a2c...7e9d",
      percentage: 30,
      totalEarned: "$7,369.17",
      role: "Developer",
    },
    {
      id: 3,
      name: "Alex Rivera",
      wallet: "0x5f1b...2c4a",
      percentage: 20,
      totalEarned: "$4,912.78",
      role: "Marketing",
    },
    {
      id: 4,
      name: "You",
      wallet: "0x742d...Ab3f",
      percentage: 10,
      totalEarned: "$2,456.39",
      role: "Project Lead",
    },
  ];

  const collections = [
    { name: "Cosmic Dreams", splits: 4, status: "Active" },
    { name: "Digital Waves", splits: 3, status: "Active" },
    { name: "Abstract Minds", splits: 2, status: "Paused" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Royalty Splits</h1>
          <p className="text-muted-foreground">Manage collaborator payments and revenue sharing</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Collaborator
        </Button>
      </div>

      {/* Collaborators */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Active Collaborators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {collaborators.map((collab) => (
            <div
              key={collab.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {collab.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{collab.name}</div>
                  <div className="text-sm text-muted-foreground">{collab.role}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">{collab.wallet}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{collab.percentage}%</div>
                  <div className="text-xs text-muted-foreground">Split</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{collab.totalEarned}</div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Collections with Splits */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Collections with Splits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collections.map((collection, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-semibold">{collection.name}</div>
                  <div className="text-sm text-muted-foreground">{collection.splits} collaborators</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    collection.status === 'Active' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {collection.status}
                  </div>
                  <Button size="sm" variant="glass">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Split */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Create New Split Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Input id="collection" placeholder="Select or enter collection name" className="glass-card border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet">Collaborator Wallet</Label>
              <Input id="wallet" placeholder="0x..." className="glass-card border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input id="percentage" type="number" placeholder="0-100" className="glass-card border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="e.g., Artist, Developer" className="glass-card border-border/50" />
            </div>
          </div>
          <Button variant="gradient" className="gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Collaborators</div>
            <div className="text-3xl font-bold gradient-text">4</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Active Splits</div>
            <div className="text-3xl font-bold gradient-text">3</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Distributed</div>
            <div className="text-3xl font-bold gradient-text">$24,563.90</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
