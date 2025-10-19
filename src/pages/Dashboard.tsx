import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { DashboardTransactions } from "@/components/dashboard/DashboardTransactions";
import { DashboardSplits } from "@/components/dashboard/DashboardSplits";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardPayouts } from "@/components/dashboard/DashboardPayouts";

export type DashboardView = "overview" | "analytics" | "transactions" | "splits" | "notifications" | "payouts";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview />;
      case "analytics":
        return <DashboardAnalytics />;
      case "transactions":
        return <DashboardTransactions />;
      case "splits":
        return <DashboardSplits />;
      case "notifications":
        return <DashboardNotifications />;
      case "payouts":
        return <DashboardPayouts />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          <main className="flex-1 overflow-auto">
          {renderView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
