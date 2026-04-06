import { useState } from "react"
import { MapPin, GraduationCap, Building2, ArrowRight, Search, ExternalLink, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { colleges } from "@/data/colleges"
import { navigate } from "@/lib/router"
import { TermTooltip } from "@/components/TermTooltip"

export function CollegesPage() {
  const communityColleges = colleges.filter((c) => c.type === "Community College")
  const universities = colleges.filter((c) => c.type === "University")

  const [ccSearch, setCcSearch] = useState("")
  const [uniSearch, setUniSearch] = useState("")
  const [ccOpen, setCcOpen] = useState(true)
  const [uniOpen, setUniOpen] = useState(true)

  const filteredCC = communityColleges.filter((c) =>
    !ccSearch.trim() ||
    c.name.toLowerCase().includes(ccSearch.toLowerCase()) ||
    c.abbreviation.toLowerCase().includes(ccSearch.toLowerCase()) ||
    c.location.toLowerCase().includes(ccSearch.toLowerCase())
  )

  const filteredUni = universities.filter((c) =>
    !uniSearch.trim() ||
    c.name.toLowerCase().includes(uniSearch.toLowerCase()) ||
    c.abbreviation.toLowerCase().includes(uniSearch.toLowerCase()) ||
    c.location.toLowerCase().includes(uniSearch.toLowerCase())
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
            Colleges &amp; <span style={{ color: "var(--brand)" }}>Universities</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Virginia institutions supported by TransferIntelligence. We have <TermTooltip termId="articulation-agreement">formal transfer agreements</TermTooltip> on file for all of these community college and university pairings.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-4xl mx-auto">

          <Collapsible open={ccOpen} onOpenChange={setCcOpen} className="mb-10">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--brand-gradient)" }}>
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">Community Colleges</h2>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${ccOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Transfer-sending institutions</p>
                  </div>
                </button>
              </CollapsibleTrigger>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  className="pl-9 h-9 text-sm"
                  placeholder="Search community colleges..."
                  value={ccSearch}
                  onChange={(e) => setCcSearch(e.target.value)}
                />
              </div>
            </div>
            <CollapsibleContent>
              {filteredCC.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No colleges match your search.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredCC.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="mb-10" />

          <Collapsible open={uniOpen} onOpenChange={setUniOpen} className="mb-10">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "oklch(0.55 0.15 145)" }}>
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">Universities</h2>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${uniOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Transfer-receiving institutions</p>
                  </div>
                </button>
              </CollapsibleTrigger>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  className="pl-9 h-9 text-sm"
                  placeholder="Search universities..."
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                />
              </div>
            </div>
            <CollapsibleContent>
              {filteredUni.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No universities match your search.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredUni.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: "var(--brand-muted)" }}
          >
            <h3 className="font-semibold text-lg mb-2">Ready to see how your courses transfer?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Use the Planner to see exactly which of your classes count between any two supported schools.
            </p>
            <Button
              className="gap-2 text-white"
              style={{ background: "var(--brand-gradient)" }}
              onClick={() => navigate("/planner")}
            >
              Start Transfer Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function CollegeCard({ college }: { college: (typeof colleges)[0] }) {
  const isCC = college.type === "Community College"

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-border">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 font-bold text-sm"
            style={{ background: isCC ? "var(--brand-gradient)" : "oklch(0.55 0.15 145)" }}
          >
            {college.abbreviation.substring(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{college.name}</h3>
            <Badge
              variant="outline"
              className="text-xs mt-1"
              style={
                isCC
                  ? { borderColor: "var(--brand)", color: "var(--brand)" }
                  : { borderColor: "oklch(0.55 0.15 145)", color: "oklch(0.45 0.15 145)" }
              }
            >
              {college.type}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{college.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          {college.location}
        </div>
        <Button
          size="sm"
          className="w-full gap-2 text-white text-xs"
          style={{ background: isCC ? "var(--brand-gradient)" : "oklch(0.55 0.15 145)" }}
          asChild
        >
          <a href={college.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Visit {college.abbreviation}
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
