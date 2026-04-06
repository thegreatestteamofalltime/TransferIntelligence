import { useState, useRef } from "react"
import { Search, MessageCircle, ArrowRight, Circle as HelpCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/data/faq"
import { navigate } from "@/lib/router"
import { withJargon } from "@/lib/jargon"
import { TransferBuddyLink } from "@/components/TransferBuddyLink"

const categories = [...new Set(faqs.map((f) => f.category))]

export function FAQPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const filteredFaqs = faqs.filter((f) => {
    const matchesQuery =
      !query ||
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !activeCategory || f.category === activeCategory
    return matchesQuery && matchesCategory
  })

  const filteredCategories = categories.filter((cat) =>
    filteredFaqs.some((f) => f.category === cat)
  )

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat)
    setQuery("")
    setTimeout(() => {
      sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  const handleSearch = (val: string) => {
    setQuery(val)
    if (val) setActiveCategory(null)
  }

  const totalCount = filteredFaqs.length

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
            Frequently Asked <span style={{ color: "var(--brand)" }}>Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            Common questions about Virginia college transfer. Still stuck? Ask <TransferBuddyLink /> or contact an advisor.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-white/80 backdrop-blur-sm border-border/60 shadow-sm"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search FAQ"
            />
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setActiveCategory(null); setQuery("") }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                !activeCategory && !query
                  ? "text-white border-transparent"
                  : "border-border text-muted-foreground hover:border-border hover:text-foreground"
              }`}
              style={!activeCategory && !query ? { backgroundColor: "var(--brand)", borderColor: "var(--brand)" } : {}}
            >
              All
              <span className="ml-1.5 text-xs opacity-70">{faqs.length}</span>
            </button>
            {categories.map((cat) => {
              const count = faqs.filter((f) => f.category === cat).length
              const isActive = activeCategory === cat && !query
              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    isActive
                      ? "text-white border-transparent"
                      : "border-border text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                  style={isActive ? { backgroundColor: "var(--brand)", borderColor: "var(--brand)" } : {}}
                >
                  {cat}
                  <span className="ml-1.5 text-xs opacity-70">{count}</span>
                </button>
              )
            })}
          </div>

          {query && (
            <div className="mb-6 flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {totalCount === 0
                  ? `No results for "${query}"`
                  : `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${query}"`}
              </p>
              {totalCount === 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-6 px-2"
                  onClick={() => setQuery("")}
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          {totalCount === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium mb-1">No questions found</p>
              <p className="text-sm">Try a different search, or ask <TransferBuddyLink /> directly.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((category) => {
                const categoryFaqs = filteredFaqs.filter((f) => f.category === category)
                return (
                  <div
                    key={category}
                    ref={(el) => { sectionRefs.current[category] = el }}
                    className="scroll-mt-20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex items-center justify-center w-7 h-7 rounded-lg"
                        style={{ backgroundColor: "color-mix(in oklch, var(--brand) 15%, transparent)" }}
                      >
                        <HelpCircle className="h-4 w-4" style={{ color: "var(--brand)" }} />
                      </div>
                      <h2 className="font-semibold text-base text-foreground">{category}</h2>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {categoryFaqs.length} {categoryFaqs.length === 1 ? "question" : "questions"}
                      </Badge>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {categoryFaqs.map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border border-border rounded-xl px-4 overflow-hidden bg-card transition-colors hover:border-border/80"
                        >
                          <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4 gap-3 [&>svg]:hidden">
                            <span className="flex-1">{withJargon(faq.question)}</span>
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 border-t border-border/50 pt-3 mt-1">
                            {withJargon(faq.answer)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              })}
            </div>
          )}

          <div
            className="rounded-2xl p-8 text-center mt-12"
            style={{ backgroundColor: "var(--brand-muted)" }}
          >
            <MessageCircle className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--brand)" }} />
            <h3 className="font-semibold text-lg mb-1">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Ask <TransferBuddyLink /> or connect with a real academic advisor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="sm"
                className="gap-2 text-white"
                style={{ background: "var(--brand-gradient)" }}
                onClick={() => navigate("/advisors")}
              >
                Contact an Advisor
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                onClick={() => navigate("/terminology")}
              >
                View Terminology
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
