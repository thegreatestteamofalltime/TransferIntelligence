import { useState, useEffect, useRef } from "react"
import { Search, ArrowRight, X } from "lucide-react"
import { navigate, getHashParams } from "@/lib/router"
import { search, type SearchResult } from "@/lib/searchIndex"

const categoryBg: Record<string, string> = {
  Page: "bg-zinc-100 text-zinc-600",
  College: "bg-blue-100 text-blue-700",
  Advisor: "bg-green-100 text-green-700",
  Term: "bg-amber-100 text-amber-700",
  FAQ: "bg-orange-100 text-orange-700",
  Course: "bg-sky-100 text-sky-700",
  Program: "bg-teal-100 text-teal-700",
}

const ALL_CATEGORIES = ["All", "Page", "College", "Program", "Course", "Advisor", "Term", "FAQ"]

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-zinc-900 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function SearchPage() {
  const [query, setQuery] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = getHashParams()
    const q = params.q ?? ""
    setQuery(q)
    setInputValue(q)
    setResults(search(q, 100))
    setActiveCategory("All")
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const params = getHashParams()
      const q = params.q ?? ""
      setQuery(q)
      setInputValue(q)
      setResults(search(q, 100))
      setActiveCategory("All")
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) return
    setQuery(q)
    setResults(search(q, 100))
    setActiveCategory("All")
    navigate("/search", { q })
  }

  const handleClear = () => {
    setInputValue("")
    setQuery("")
    setResults([])
    inputRef.current?.focus()
    navigate("/search")
  }

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.route)
    if (result.category === "Term") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("terminology-search", { detail: result.title }))
      }, 100)
    }
  }

  const filteredResults =
    activeCategory === "All" ? results : results.filter((r) => r.category === activeCategory)

  const categoryCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "All" ? results.length : results.filter((r) => r.category === cat).length
    return acc
  }, {})

  const groupedResults = filteredResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {query ? (
              <>
                Results for{" "}
                <span style={{ color: "var(--brand)" }}>"{query}"</span>
              </>
            ) : (
              "Search"
            )}
          </h1>
          {query && results.length > 0 && (
            <p className="text-sm text-muted-foreground mb-5">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search colleges, courses, advisors, terminology..."
              className="w-full h-11 pl-9 pr-10 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full">
        {query && (
          <div className="flex flex-wrap gap-2 mb-6">
            {ALL_CATEGORIES.filter((cat) => cat === "All" || categoryCounts[cat] > 0).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat
                    ? "text-white border-transparent"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground"
                }`}
                style={activeCategory === cat ? { background: "var(--brand-gradient)" } : {}}
              >
                {cat}
                <span className={`text-xs font-semibold tabular-nums ${activeCategory === cat ? "opacity-80" : "opacity-60"}`}>
                  {categoryCounts[cat]}
                </span>
              </button>
            ))}
          </div>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--brand-muted)" }}>
              <Search className="h-8 w-8" style={{ color: "var(--brand)" }} />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">Search everything</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Find colleges, programs, courses, advisors, terminology, and answers to common questions.
            </p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">No results found</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              No matches for <span className="font-medium text-foreground">"{query}"</span>. Try a different term or browse the pages directly.
            </p>
          </div>
        )}

        {query && filteredResults.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${categoryBg[category] ?? "bg-muted text-muted-foreground"}`}>
                    {category}
                  </span>
                  <span>{items.length} result{items.length !== 1 ? "s" : ""}</span>
                </h2>
                <div className="space-y-1">
                  {items.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className="w-full flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent text-left transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {highlight(result.title, query)}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {highlight(result.subtitle, query)}
                          </p>
                        )}
                        {result.detail && (
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                            {highlight(result.detail, query)}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
