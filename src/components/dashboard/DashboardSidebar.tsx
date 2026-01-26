import { Home, TrendingUp, History, Users, Wallet, Bell, RefreshCw, Cog } from "lucide-react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDapperWallet } from "@/hooks/use-dapper-wallet";
import { useToast } from "@/hooks/use-toast";
import * as fcl from "@onflow/fcl";

interface DashboardSidebarProps {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
}

export function DashboardSidebar({ currentView, setCurrentView }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const { user, disconnect } = useDapperWallet();
  const { toast } = useToast();

  const menuItems = [
    { id: "overview" as DashboardView, title: "Overview", icon: Home },
    { id: "analytics" as DashboardView, title: "Analytics", icon: TrendingUp },
    { id: "transactions" as DashboardView, title: "Transactions", icon: History },
    { id: "splits" as DashboardView, title: "Royalty Splits", icon: Users },
    { id: "notifications" as DashboardView, title: "Notifications", icon: Bell },
    { id: "payouts" as DashboardView, title: "Payouts", icon: RefreshCw },
    { id: "settings" as DashboardView, title: "Settings", icon: Cog },
  ];

  const handleSwitchWallet = async () => {
    setShowSwitchDialog(true);
  };

  const handleWalletConnect = async (walletType: string) => {
    try {
      // Disconnect current wallet first
      await disconnect();
      
      // Connect to new wallet
      if (walletType === 'dapper') {
        await fcl.authenticate();
      } else if (walletType === 'blocto') {
        await fcl.authenticate();
      }
      
      toast({
        title: "Wallet switched",
        description: `Successfully switched to ${walletType} wallet`,
      });
      
      setShowSwitchDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch wallet. Please try again.",
        variant: "destructive",
      });
      console.error("Wallet switch error:", error);
    }
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 ease-in-out`}>
      <div className="p-4 border-b border-border/50 transition-all duration-300">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-slide-in-left">
            <Wallet className="h-6 w-6 text-primary sidebar-icon animate-glow-pulse" />
            <span className="text-lg font-bold gradient-text animate-gradient-shift">CreatorStream</span>
          </div>
        )}
        {collapsed && (
          <Wallet className="h-6 w-6 text-primary mx-auto sidebar-icon animate-pulse-subtle" />
        )}
      </div>

  <SidebarTrigger className="m-2 self-end transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary active:scale-95" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.id)}
                    className={`
                      sidebar-item animate-slide-in-scale stagger-${index + 1}
                      ${
                        currentView === item.id
                          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary shadow-lg glow-primary"
                          : "hover:bg-muted/50 hover:shadow-md hover:border-l-2 hover:border-primary/50"
                      }
                      transition-all duration-300 ease-out
                      hover:scale-[1.02] active:scale-[0.98]
                    `}
                  >
                    <item.icon className="h-4 w-4 sidebar-icon" />
                    {!collapsed && (
                      <span className="transition-all duration-300 ease-out">
                        {item.title}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        {/* Wallet */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="animate-slide-in-left stagger-7">Wallet</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="glass-card p-3 rounded-lg m-2 space-y-2 animate-slide-in-scale stagger-7 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              {!collapsed ? (
                <>
                  <div className="text-xs text-muted-foreground mb-1 transition-all duration-300">Connected</div>
                  <div className="text-sm font-mono truncate transition-all duration-300 hover:text-primary">
                    {user?.addr ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}` : '0x742d...Ab3f'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="glass" 
                      className="text-xs transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                      onClick={() => handleWalletConnect('dapper')}
                    >
                      Dapper
                    </Button>
                    <Button 
                      size="sm" 
                      variant="glass" 
                      className="text-xs transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                      onClick={() => handleWalletConnect('blocto')}
                    >
                      Blocto
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full gap-1 transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:border-primary"
                    onClick={handleSwitchWallet}
                  >
                    <RefreshCw className="h-3 w-3 transition-transform duration-300 hover:rotate-180" /> 
                    Switch Wallet
                  </Button>
                </>
              ) : (
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto animate-pulse-subtle" />
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Switch Wallet Dialog */}
      <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet provider to connect with
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-4"
              onClick={() => handleWalletConnect('dapper')}
            >
              <Wallet className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Dapper Wallet</div>
                <div className="text-xs text-muted-foreground">Connect with Dapper</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-4"
              onClick={() => handleWalletConnect('blocto')}
            >
              <Wallet className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Blocto Wallet</div>
                <div className="text-xs text-muted-foreground">Connect with Blocto</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
