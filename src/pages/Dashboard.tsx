import { useState, lazy, Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardOverview = lazy(() => import("@/components/dashboard/DashboardOverview"));
const DashboardAnalytics = lazy(() => import("@/components/dashboard/DashboardAnalytics"));
const DashboardTransactions = lazy(() => import("@/components/dashboard/DashboardTransactions"));
const DashboardSplits = lazy(() => import("@/components/dashboard/DashboardSplits"));
const DashboardNotifications = lazy(() => import("@/components/dashboard/DashboardNotifications"));
const DashboardPayouts = lazy(() => import("@/components/dashboard/DashboardPayouts"));

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
            <Suspense fallback={<div className="p-4"><Skeleton className="h-48 w-full" /></div>}>
              {renderView()}
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
