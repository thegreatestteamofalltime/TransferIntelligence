import { BookOpen, ExternalLink, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { terms } from "@/data/terminology"
import { TransferBuddyLink } from "@/components/TransferBuddyLink"

export function TerminologyPage() {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const handler = (e: Event) => {
      setQuery((e as CustomEvent).detail as string)
    }
    window.addEventListener("terminology-search", handler)
    return () => window.removeEventListener("terminology-search", handler)
  }, [])

  const filtered = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(query.toLowerCase()) ||
      t.definition.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      <section
        className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.97 0.02 196) 0%, oklch(1 0 0) 50%, oklch(0.98 0.01 220) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, var(--brand) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.65 0.14 210) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance mb-4">
            Transfer <span style={{ color: "var(--brand)" }}>Terminology</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Key terms used in Virginia college transfer. Hover over highlighted words anywhere on the site for instant definitions.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search transfer terms"
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No terms found for "{query}"</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((term, idx) => (
          <Card key={term.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="px-5 py-4"
                style={{ borderLeft: "4px solid var(--brand)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-bold tracking-tight">{term.term}</h2>
                  <Badge
                    variant="secondary"
                    className="text-xs flex-shrink-0 mt-0.5"
                  >
                    #{idx + 1}
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground mb-3">{term.definition}</p>

                {term.example && (
                  <>
                    <Separator className="mb-3" />
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Example
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{term.example}</p>
                    </div>
                  </>
                )}

                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-xs text-muted-foreground">Related:</span>
                    {term.relatedTerms.map((rel) => (
                      <Badge
                        key={rel}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-accent"
                        style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                        onClick={() => setQuery(rel)}
                      >
                        {rel}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 p-8 rounded-2xl text-center" style={{ backgroundColor: "var(--brand-muted)" }}>
        <BookOpen className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--brand)" }} />
        <h3 className="font-semibold text-lg mb-2">Need a term explained in context?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Hover over highlighted terms on the Planner and other pages for instant definitions.
          Or ask <TransferBuddyLink /> — our AI assistant — any transfer-related question.
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span>Definitions sourced from Virginia VCCS Transfer Policies</span>
        </div>
      </div>
        </div>
      </section>
    </div>
  )
}
