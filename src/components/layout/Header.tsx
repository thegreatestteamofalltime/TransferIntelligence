import { useState } from "react"
import { Menu, Mail, Info, Circle as HelpCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [searchValue, setSearchValue] = useState("")

  const handleNav = (route: Route) => {
    navigate(route)
    setOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = searchValue.trim()
    if (!term) return
    navigate("/terminology")
    window.dispatchEvent(new CustomEvent("terminology-search", { detail: term }))
    setSearchValue("")
    setOpen(false)
  }

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <button
          onClick={() => handleNav("/")}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
          aria-label="Go to home"
        >
          <img
            src="/logo_inital.png"
            alt="TransferIntelligence"
            style={{ height: 42, width: "auto", objectFit: "contain" }}
          />
        </button>

        <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNav(link.route)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring whitespace-nowrap ${
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

        <div className="flex items-center gap-3 ml-auto">
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-9 pl-8 pr-3 w-52 text-sm rounded-lg"
              aria-label="Search transfer terms"
            />
          </form>
          <Button
            size="sm"
            className="hidden md:flex text-white font-semibold text-sm px-5 h-9 border-0"
            style={{ background: "var(--brand-gradient)" }}
            onClick={() => handleNav("/planner")}
          >
            Start Planning
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">
                  <img
                    src="/logo_inital.png"
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
                  style={{ background: "var(--brand-gradient)" }}
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
