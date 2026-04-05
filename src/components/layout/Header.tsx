import { useState } from "react"
import { Menu, Mail, Info, Circle as HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navigate, type Route } from "@/lib/router"

const navLinks: { label: string; route: Route }[] = [
  { label: "Home", route: "/" },
  { label: "Get Started", route: "/get-started" },
  { label: "Colleges", route: "/colleges" },
  { label: "Programs", route: "/programs" },
  { label: "Advisors", route: "/advisors" },
  { label: "Agreements", route: "/agreements" },
  { label: "Terminology", route: "/terminology" },
]

const menuLinks: { label: string; route: Route; icon: React.ReactNode }[] = [
  { label: "FAQ", route: "/faq", icon: <HelpCircle className="h-4 w-4" /> },
  { label: "Contact", route: "/contact", icon: <Mail className="h-4 w-4" /> },
  { label: "About", route: "/about", icon: <Info className="h-4 w-4" /> },
]

interface HeaderProps {
  currentRoute: Route
}

export function Header({ currentRoute }: HeaderProps) {
  const [open, setOpen] = useState(false)

  const handleNav = (route: Route) => {
    navigate(route)
    setOpen(false)
  }

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <button
          onClick={() => handleNav("/")}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring rounded-lg md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto"
          aria-label="Go to home"
        >
          <img
            src="/image.png"
            alt="TransferIntelligence"
            style={{ height: 32, width: "auto", objectFit: "contain" }}
          />
        </button>

        <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNav(link.route)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                currentRoute === link.route
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              style={currentRoute === link.route ? { color: "var(--brand)" } : {}}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden w-8" />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="hidden md:flex text-white text-xs px-3 h-8"
            style={{ backgroundColor: "var(--brand)" }}
            onClick={() => handleNav("/planner")}
          >
            Start Planning
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">
                  <img
                    src="/image.png"
                    alt="TransferIntelligence"
                    style={{ height: 36, width: "auto", objectFit: "contain" }}
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="md:hidden mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Navigation
                </p>
                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link) => (
                    <button
                      key={link.route}
                      onClick={() => handleNav(link.route)}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                        currentRoute === link.route
                          ? "bg-accent text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      style={currentRoute === link.route ? { color: "var(--brand)" } : {}}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  More
                </p>
                <nav className="flex flex-col gap-0.5">
                  {menuLinks.map((link) => (
                    <button
                      key={link.route}
                      onClick={() => handleNav(link.route)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                        currentRoute === link.route
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: "var(--brand)" }}
                  onClick={() => handleNav("/planner")}
                >
                  Start Transfer Plan
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
