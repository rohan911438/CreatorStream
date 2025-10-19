import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { DashboardTransactions } from "@/components/dashboard/DashboardTransactions";
import { DashboardSplits } from "@/components/dashboard/DashboardSplits";

export type DashboardView = "overview" | "analytics" | "transactions" | "splits";

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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
