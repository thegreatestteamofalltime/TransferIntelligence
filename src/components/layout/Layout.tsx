import { ChevronRight, Hop as Home } from "lucide-react"
import { Header } from "./Header"
import { FloatingChat } from "./FloatingChat"
import { navigate, type Route } from "@/lib/router"

const routeLabels: Partial<Record<Route, string>> = {
  "/get-started": "Get Started",
  "/planner": "Transfer Planner",
  "/terminology": "Terminology",
  "/colleges": "Colleges",
  "/programs": "Programs",
  "/advisors": "Advisors",
  "/agreements": "Agreements",
  "/faq": "FAQ",
  "/contact": "Contact",
  "/about": "About",
}

interface LayoutProps {
  currentRoute: Route
  children: React.ReactNode
}

export function Layout({ currentRoute, children }: LayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      <div className="sticky top-0 z-50 px-3 sm:px-4 pt-3">
        <div
          className="rounded-xl overflow-hidden shadow-sm bg-background"
          style={{ border: "1px solid oklch(0.80 0.06 245)" }}
        >
          <Header currentRoute={currentRoute} />
        </div>
      </div>

      <div className="px-3 sm:px-4 pt-3 pb-4 flex flex-col gap-3 flex-1">
        <div
          className="rounded-xl overflow-hidden shadow-sm bg-background flex-1 min-h-0"
          style={{ border: "1px solid oklch(0.80 0.06 245)" }}
        >
          {currentRoute !== "/" && routeLabels[currentRoute] && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-border text-xs text-muted-foreground"
            >
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                aria-label="Home"
              >
                <Home className="h-3 w-3" />
                <span>Home</span>
              </button>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium text-foreground">{routeLabels[currentRoute]}</span>
            </nav>
          )}
          <main>{children}</main>
        </div>

        <div
          className="rounded-xl overflow-hidden shadow-sm bg-background"
          style={{ border: "1px solid oklch(0.80 0.06 245)" }}
        >
          <footer className="px-4 sm:px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                &copy; {new Date().getFullYear()} TransferIntelligence &mdash; Hackathon Prototype
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Information provided is for demonstration purposes only and does not reflect real life.
              </p>
            </div>
          </footer>
        </div>
      </div>

      <FloatingChat />
    </div>
  )
}
