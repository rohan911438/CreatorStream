import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockNotifications } from "@/lib/data";
import { Bell } from "lucide-react";

export function DashboardNotifications() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Notifications</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockNotifications.map((n) => (
          <Card key={n.id} className="glass-card border border-border/40">
            <CardHeader>
              <CardTitle className="text-base">{n.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <div className="text-xs text-muted-foreground/80 mt-3">{new Date(n.dateISO).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
