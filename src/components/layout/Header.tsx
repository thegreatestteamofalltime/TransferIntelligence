import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Menu, Mail, Info, Circle as HelpCircle, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navigate, type Route } from "@/lib/router"
import { search, type SearchResult } from "@/lib/searchIndex"

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

const categoryBg: Record<string, string> = {
  Page: "bg-zinc-100 text-zinc-600",
  College: "bg-blue-100 text-blue-700",
  Advisor: "bg-green-100 text-green-700",
  Term: "bg-amber-100 text-amber-700",
  FAQ: "bg-orange-100 text-orange-700",
  Course: "bg-sky-100 text-sky-700",
  Program: "bg-teal-100 text-teal-700",
}

interface DropdownPortalProps {
  anchorRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

function DropdownPortal({ anchorRef, children }: DropdownPortalProps) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const update = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect())
    }
    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [anchorRef])

  if (!rect) return null

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: 320,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  )
}

interface HeaderProps {
  currentRoute: Route
}

export function Header({ currentRoute }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNav = (route: Route) => {
    navigate(route)
    setOpen(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    const res = search(value)
    setResults(res)
    setDropdownOpen(value.trim().length >= 2)
    setActiveIndex(-1)
  }

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.route)
    if (result.category === "Term") {
      window.dispatchEvent(new CustomEvent("terminology-search", { detail: result.title }))
    }
    setSearchValue("")
    setResults([])
    setDropdownOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (dropdownOpen && activeIndex >= 0) {
        handleSelectResult(results[activeIndex])
      } else {
        const q = searchValue.trim()
        if (q) {
          setDropdownOpen(false)
          setActiveIndex(-1)
          navigate("/search", { q })
        }
      }
      return
    }
    if (!dropdownOpen || results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === "Escape") {
      setDropdownOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showDropdown = dropdownOpen && searchValue.trim().length >= 2

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
          <div ref={searchWrapperRef} className="hidden md:block relative">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none z-10" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchValue.trim().length >= 2 && setDropdownOpen(true)}
                className="h-9 pl-8 pr-3 w-52 text-sm rounded-lg"
                aria-label="Search all pages"
                aria-expanded={dropdownOpen}
                aria-autocomplete="list"
                autoComplete="off"
              />
            </div>

            {showDropdown && (
              <DropdownPortal anchorRef={searchWrapperRef}>
                <div className="light bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden text-zinc-900">
                  {results.length > 0 ? (
                    <>
                      <ul role="listbox" className="py-1 max-h-72 overflow-y-auto">
                        {results.map((result, index) => (
                          <li key={result.id} role="option" aria-selected={index === activeIndex}>
                            <button
                              className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                                index === activeIndex ? "bg-zinc-100" : "hover:bg-zinc-50"
                              }`}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectResult(result)}
                              onMouseEnter={() => setActiveIndex(index)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span
                                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${categoryBg[result.category] ?? "bg-zinc-100 text-zinc-600"}`}
                                  >
                                    {result.category}
                                  </span>
                                  <span className="text-sm font-medium text-zinc-900 truncate">
                                    {result.title}
                                  </span>
                                </div>
                                {result.subtitle && (
                                  <p className="text-xs text-zinc-500 truncate pl-0.5">
                                    {result.subtitle}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-1" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-zinc-200 px-3 py-2">
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            const q = searchValue.trim()
                            if (q) {
                              setDropdownOpen(false)
                              navigate("/search", { q })
                            }
                          }}
                          className="w-full flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-900 transition-colors py-0.5"
                        >
                          <span>See all results for <span className="font-medium text-zinc-900">"{searchValue}"</span></span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-sm text-zinc-500">
                        No results for{" "}
                        <span className="font-medium text-zinc-900">"{searchValue}"</span>
                      </p>
                    </div>
                  )}
                </div>
              </DropdownPortal>
            )}
          </div>

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
