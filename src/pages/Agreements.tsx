import { useState, useMemo } from "react"
import {
  Search,
  CircleCheck as CheckCircle2,
  ChevronDown,
  ExternalLink,
  Clock,
  GraduationCap,
  CalendarDays,
  FileText,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ALL_AGREEMENTS, type ArticulationAgreement, type GAASection } from "@/data/agreements/vccs-vsu-gaa"

const ALL_COLLEGES = Array.from(
  new Set(ALL_AGREEMENTS.flatMap((a) => [...a.sourceInstitutions, a.targetInstitution]))
).sort()

const ALL_DEGREES = Array.from(
  new Set(ALL_AGREEMENTS.flatMap((a) => a.admissionRequirements.applicableDegrees))
).sort()

function SectionRow({ section }: { section: GAASection }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full text-left flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-accent transition-colors">
          <span className="text-sm font-semibold text-foreground">{section.title}</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-muted-foreground leading-relaxed">{section.summary}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function AgreementCard({ agreement }: { agreement: ArticulationAgreement }) {
  const [open, setOpen] = useState(false)
  const req = agreement.admissionRequirements

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border overflow-hidden bg-card shadow-sm">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="pb-4 hover:bg-accent/40 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      className="text-xs font-semibold"
                      style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
                    >
                      {agreement.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700 bg-green-50">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {agreement.sourceSystem.split("(")[0].trim()} →{" "}
                    <span style={{ color: "var(--brand)" }}>{agreement.targetInstitution}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{agreement.title}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 border border-border">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated <strong className="text-foreground">{agreement.lastUpdated}</strong></span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
                  <span>Min. GPA: <strong className="text-foreground">{req.minimumGPA.toFixed(1)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
                  <span>Max transfer credits: <strong className="text-foreground">{req.maximumTransferCredits}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
                  <span>
                    Deadlines:{" "}
                    <strong className="text-foreground">
                      {req.applicationDeadlines.map((d) => `${d.term} ${d.deadline}`).join(" · ")}
                    </strong>
                  </span>
                </div>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-5">
            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                What you need to qualify
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: req.minimumGPA.toFixed(1), label: "Min. GPA" },
                  { value: `${req.minimumCreditsAtVCCS}+`, label: "Credits at VCCS" },
                  { value: req.courseGradeMinimum, label: "Min. course grade" },
                  { value: `${req.maximumTransferCredits}`, label: "Max. transfer credits" },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                    <div className="text-2xl font-black text-foreground">{value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">No SAT or ACT required</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Application deadlines
              </h4>
              <div className="flex flex-wrap gap-3">
                {req.applicationDeadlines.map((d) => (
                  <div key={d.term} className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <span className="text-sm font-bold text-foreground">{d.term}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm text-muted-foreground">{d.deadline}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Eligible degree types
              </h4>
              <div className="flex flex-wrap gap-2">
                {req.applicableDegrees.map((deg) => (
                  <Badge
                    key={deg}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: "oklch(0.72 0.14 196 / 0.4)", color: "var(--brand)" }}
                  >
                    {deg}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                What this gets you
              </h4>
              <ul className="space-y-2.5">
                {agreement.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Common questions
              </h4>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {agreement.sections.map((section) => (
                  <SectionRow key={section.id} section={section} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Read the official signed agreement</p>
              </div>
              <a
                href={agreement.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0 hover:underline"
                style={{ color: "var(--brand)" }}
                onClick={(e) => e.stopPropagation()}
              >
                View PDF
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs text-amber-800 leading-relaxed">
                This information is for reference only and was last updated <strong>{agreement.lastUpdated}</strong>. Always confirm current requirements with an academic advisor before making enrollment decisions.
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export function AgreementsPage() {
  const [search, setSearch] = useState("")
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [degreeFilter, setDegreeFilter] = useState("all")

  const isFiltered = search.trim() !== "" || collegeFilter !== "all" || degreeFilter !== "all"

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return ALL_AGREEMENTS.filter((a) => {
      const matchesSearch =
        !q ||
        a.targetInstitution.toLowerCase().includes(q) ||
        a.sourceSystem.toLowerCase().includes(q) ||
        a.sourceInstitutions.some((s) => s.toLowerCase().includes(q)) ||
        a.title.toLowerCase().includes(q)

      const matchesCollege =
        collegeFilter === "all" ||
        a.targetInstitution === collegeFilter ||
        a.sourceInstitutions.includes(collegeFilter)

      const matchesDegree =
        degreeFilter === "all" ||
        a.admissionRequirements.applicableDegrees.includes(degreeFilter)

      return matchesSearch && matchesCollege && matchesDegree
    })
  }, [search, collegeFilter, degreeFilter])

  function clearFilters() {
    setSearch("")
    setCollegeFilter("all")
    setDegreeFilter("all")
  }

  return (
    <div className="flex flex-col bg-background">
      <section
        className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.96 0.025 196) 0%, oklch(1 0 0) 55%, oklch(0.97 0.015 220) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 60%, var(--brand) 0%, transparent 55%), radial-gradient(circle at 85% 20%, oklch(0.6 0.15 210) 0%, transparent 55%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance mb-4">
            Transfer <span style={{ color: "var(--brand)" }}>Agreements</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Official agreements that guarantee your credits transfer and secure your spot at a 4-year university — no SAT required.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-5">

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9 bg-background"
                placeholder="Search by college or agreement name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              <option value="all">All Colleges</option>
              {ALL_COLLEGES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
            >
              <option value="all">All Degree Types</option>
              {ALL_DEGREES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{filtered.length}</strong>{" "}
                agreement{filtered.length !== 1 ? "s" : ""} found
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1.5"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </Button>
            </div>
          )}

          {!isFiltered && (
            <p className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{ALL_AGREEMENTS.length}</strong>{" "}
              agreement{ALL_AGREEMENTS.length !== 1 ? "s" : ""}
            </p>
          )}

          {filtered.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="py-14 text-center">
                <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No agreements found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((agreement) => (
                <AgreementCard key={agreement.id} agreement={agreement} />
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
