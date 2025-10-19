import { Home, TrendingUp, History, Users, Wallet } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardView } from "@/pages/Dashboard";

interface DashboardSidebarProps {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
}

export function DashboardSidebar({ currentView, setCurrentView }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    { id: "overview" as DashboardView, title: "Overview", icon: Home },
    { id: "analytics" as DashboardView, title: "Analytics", icon: TrendingUp },
    { id: "transactions" as DashboardView, title: "Transactions", icon: History },
    { id: "splits" as DashboardView, title: "Royalty Splits", icon: Users },
  ];

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <div className="p-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold gradient-text">CreatorStream</span>
          </div>
        )}
        {collapsed && (
          <Wallet className="h-6 w-6 text-primary mx-auto" />
        )}
      </div>

      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.id)}
                    className={
                      currentView === item.id
                        ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                        : "hover:bg-muted/50"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Wallet</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="glass-card p-3 rounded-lg m-2">
              {!collapsed ? (
                <>
                  <div className="text-xs text-muted-foreground mb-1">Connected</div>
                  <div className="text-sm font-mono">0x742d...Ab3f</div>
                </>
              ) : (
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" />
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
