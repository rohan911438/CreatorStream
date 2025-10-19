import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function DashboardTopbar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Welcome back
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={theme === "light" ? "gradient" : "glass"}
            onClick={() => setTheme("light")}
            className="gap-1"
            aria-pressed={theme === "light"}
            aria-label="Switch to light theme"
          >
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Light</span>
          </Button>
          <Button
            size="sm"
            variant={theme === "dark" ? "gradient" : "glass"}
            onClick={() => setTheme("dark")}
            className="gap-1"
            aria-pressed={theme === "dark"}
            aria-label="Switch to dark theme"
          >
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Dark</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
