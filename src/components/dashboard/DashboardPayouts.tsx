import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCancelPayout, usePayouts, useRetryPayout } from "@/lib/payouts";

export function DashboardPayouts() {
  const { data, isLoading } = usePayouts();
  const { mutateAsync: retry, isPending: retrying } = useRetryPayout();
  const { mutateAsync: cancel, isPending: canceling } = useCancelPayout();
  const payouts = data?.payouts ?? [];

  const color = (s: string) => s === 'completed' ? 'bg-green-500/15 text-green-500' : s === 'processing' ? 'bg-blue-500/15 text-blue-500' : s === 'queued' ? 'bg-yellow-500/15 text-yellow-500' : s === 'failed' ? 'bg-red-500/15 text-red-500' : 'bg-muted text-muted-foreground';

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Payout Jobs</h1>
        <p className="text-muted-foreground">Track, retry, or cancel your royalty payout jobs</p>
      </div>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && !payouts.length && <div className="text-sm text-muted-foreground">No payout jobs yet</div>}
          <div className="space-y-3">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-semibold">{p.id}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm">{p.recipients.length} recipients</div>
                  <div className="text-xs text-muted-foreground">Token: {p.token} • Amount: ${p.amountUSD.toFixed(2)}</div>
                </div>
                <Badge className={color(p.status)}>{p.status}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={retrying || p.status==='processing'} onClick={()=>retry(p.id)}>Retry</Button>
                  <Button size="sm" variant="ghost" disabled={canceling || p.status==='completed' || p.status==='failed' || p.status==='canceled'} onClick={()=>cancel(p.id)}>Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
