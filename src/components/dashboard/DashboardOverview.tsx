import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Clock, Activity, Calendar, Users, Trophy, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatUSD, nextPayout, mockPayouts } from "@/lib/data";
import { useOffchainRoyalties, useAddOffchainRoyalty } from "@/lib/royalties";
import { useMemo, useState, useEffect } from "react";
import { useCreatePayout } from "@/lib/royalties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCollaborators } from "@/lib/collaborators";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverview() {
  const { data: offchain, isLoading: loadingOff } = useOffchainRoyalties();
  const { mutateAsync: addOffchain, isPending: addingOff } = useAddOffchainRoyalty();
  const [token, setToken] = useState<'FLOW'|'USDC'|'FROTH'>('FLOW');
  const { mutateAsync: createPayout, isPending } = useCreatePayout();
  const { data: collabData, isLoading: loadingCollab } = useCollaborators();
  const recipients = useMemo(() => {
    const list = collabData?.collaborators ?? [];
    return list.map(c => ({ wallet: c.wallet, percentage: Number(c.percentage) || 0 }));
  }, [collabData]);

  const isLoading = loadingOff || loadingCollab;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your royalties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Royalties Earned</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg"><DollarSign className="h-4 w-4 text-primary" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">12.45 ETH</div>
                <p className="text-xs text-muted-foreground mt-1">≈ $24,890 USD</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg"><Clock className="h-4 w-4 text-primary" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">2.7 ETH</div>
                <p className="text-xs text-muted-foreground mt-1">3 scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg"><TrendingUp className="h-4 w-4 text-primary" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">2.85 ETH</div>
                <p className="text-xs text-muted-foreground mt-1">+23.1%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Collaborators</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg"><Users className="h-4 w-4 text-primary" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">{collabData?.collaborators?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Across 8 collections</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Pending Payouts and Recent Transactions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Upcoming Payouts</CardTitle>
            <CardDescription>Scheduled royalty distributions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {mockPayouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{payout.collection}</p>
                      <p className="text-sm text-muted-foreground">{payout.recipients} recipient{payout.recipients > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-bold gradient-text">{formatUSD(payout.amountUSD)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payout.dateISO).toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">Scheduled</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest royalty payments received</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {offchain?.royalties.slice(0, 3).map((tx: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                    <div className="flex-1">
                      <div className="font-medium">{tx.nftId}</div>
                      <div className="text-sm text-muted-foreground">{tx.marketplace}</div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="font-semibold gradient-text">{formatUSD(tx.amountUSD)}</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Completed</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="text-lg font-semibold">Withdraw Pending Royalties</h3>
            <p className="text-muted-foreground">Choose payout token and distribute automatically</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Payout Token</div>
                <Select value={token} onValueChange={(v: any) => setToken(v)}>
                  <SelectTrigger><SelectValue placeholder="Select token" /></SelectTrigger>
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
                      if (!recipients.length) {
                        toast.error('No collaborators found', { description: 'Add collaborators in Royalty Splits first.' });
                        return;
                      }
                      const totalPct = recipients.reduce((s,r)=>s+(r.percentage||0),0);
                      if (Math.abs(totalPct - 100) > 0.01) {
                        toast.error('Split total must be 100%', { description: `Current total: ${totalPct}%` });
                        return;
                      }
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

        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Total Royalties Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">{formatUSD(24563.9)}</div>
            <div className="text-xs text-muted-foreground mt-1">Lifetime</div>
          </CardContent>
        </Card>
        <Card>
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
