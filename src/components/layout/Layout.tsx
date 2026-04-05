import { Header } from "./Header"
import { FloatingChat } from "./FloatingChat"
import type { Route } from "@/lib/router"

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
