import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAddCollaborator, useCollaborators, useDeleteCollaborator, useUpdateCollaborator } from "@/lib/collaborators";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function DashboardSplits() {
  const { data, isLoading } = useCollaborators();
  const { mutateAsync: addCollaborator, isPending: adding } = useAddCollaborator();
  const { mutateAsync: updateCollaborator } = useUpdateCollaborator();
  const { mutateAsync: deleteCollaborator, isPending: deleting } = useDeleteCollaborator();
  const [form, setForm] = useState({ name: '', wallet: '', percentage: '', role: '' });

  const collaborators = data?.collaborators ?? [];
  const totalPct = useMemo(() => collaborators.reduce((s, c) => s + (Number(c.percentage) || 0), 0), [collaborators]);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Royalty Splits</h1>
          <p className="text-muted-foreground">Manage collaborator payments and revenue sharing</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Collaborators</div>
            <div className="text-3xl font-bold gradient-text">{collaborators.length}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Split Total</div>
            <div className={`text-3xl font-bold ${Math.abs(totalPct-100)<0.01 ? 'gradient-text' : 'text-red-500'}`}>{totalPct}%</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Status</div>
            <div className="text-3xl font-bold gradient-text">{Math.abs(totalPct-100)<0.01 ? 'Ready' : 'Fix Splits'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Collaborator */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Add Collaborator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e)=>setForm(f=>({...f, name:e.target.value}))} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet</Label>
              <Input id="wallet" value={form.wallet} onChange={(e)=>setForm(f=>({...f, wallet:e.target.value}))} placeholder="0x..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input id="percentage" type="number" value={form.percentage} onChange={(e)=>setForm(f=>({...f, percentage:e.target.value}))} placeholder="0-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={form.role} onChange={(e)=>setForm(f=>({...f, role:e.target.value}))} placeholder="Artist, Dev..." />
            </div>
          </div>
          <Button
            variant="gradient"
            className="gap-2"
            disabled={adding}
            onClick={async ()=>{
              const pct = Number(form.percentage) || 0;
              if (!form.name || !form.wallet) return toast.error('Name and wallet required');
              if (pct <= 0 || pct > 100) return toast.error('Percentage must be between 1-100');
              try {
                await addCollaborator({ name: form.name, wallet: form.wallet, percentage: pct, role: form.role });
                setForm({ name:'', wallet:'', percentage:'', role:'' });
                toast.success('Collaborator added');
              } catch (e:any) {
                toast.error('Failed to add collaborator', { description: e?.message });
              }
            }}
          >
            <Plus className="h-4 w-4" /> Add Collaborator
          </Button>
        </CardContent>
      </Card>

      {/* Collaborators List */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Active Collaborators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && !collaborators.length && <div className="text-sm text-muted-foreground">No collaborators yet</div>}
          {collaborators.map((collab) => (
            <div key={collab.id} className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors">
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
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <Input
                    className="w-24"
                    type="number"
                    value={collab.percentage ?? 0}
                    onChange={async (e)=>{
                      const pct = Number(e.target.value)||0;
                      try { await updateCollaborator({ id: collab.id, patch: { percentage: pct } }); } catch {}
                    }}
                  />
                  <div className="text-xs text-muted-foreground text-center mt-1">%</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={deleting}
                  onClick={async ()=>{
                    try { await deleteCollaborator(collab.id); toast.success('Deleted'); } catch (e:any) { toast.error('Delete failed', { description: e?.message }); }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
