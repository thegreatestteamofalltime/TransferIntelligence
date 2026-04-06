import { Mail, Search, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { advisors } from "@/data/advisors"
import { TermTooltip } from "@/components/TermTooltip"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((p) => !p.startsWith("Dr.") && !p.startsWith("Mr.") && !p.startsWith("Ms.") && p.length > 1)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function getContactLabel(name: string, gender?: "male" | "female"): string {
  const parts = name.split(" ")
  const lastName = parts[parts.length - 1]
  if (name.startsWith("Dr.")) return `Contact Dr. ${lastName}`
  if (name.startsWith("Mr.")) return `Contact Mr. ${lastName}`
  if (name.startsWith("Ms.") || name.startsWith("Mrs.")) return `Contact Ms. ${lastName}`
  if (gender === "male") return `Contact Mr. ${lastName}`
  return `Contact Ms. ${lastName}`
}

const AVATAR_COLORS = [
  "oklch(0.65 0.14 196)",
  "oklch(0.55 0.15 145)",
  "oklch(0.65 0.14 250)",
  "oklch(0.65 0.14 30)",
  "oklch(0.60 0.14 320)",
  "oklch(0.62 0.16 80)",
  "oklch(0.58 0.14 210)",
  "oklch(0.55 0.16 170)",
]

const ALL_SCHOOLS = Array.from(new Set(advisors.map((a) => a.school))).sort()

function getHashParams(): { college?: string; universities?: string[] } {
  const hash = window.location.hash
  const qIdx = hash.indexOf("?")
  if (qIdx === -1) return {}
  const params = new URLSearchParams(hash.slice(qIdx + 1))
  const college = params.get("college") ?? undefined
  const universitiesRaw = params.get("universities")
  const universities = universitiesRaw ? universitiesRaw.split(",").map((u) => u.trim()).filter(Boolean) : undefined
  return { college, universities }
}

export function AdvisorsPage() {
  const [query, setQuery] = useState("")
  const [collegeFilter, setCollegeFilter] = useState<string>("all")
  const [pinnedSchools, setPinnedSchools] = useState<string[]>([])

  useEffect(() => {
    const { college, universities } = getHashParams()
    const pinned: string[] = []
    if (college) {
      const match = ALL_SCHOOLS.find((s) => s.toLowerCase().includes(college.toLowerCase()))
      if (match) pinned.push(match)
    }
    if (universities?.length) {
      for (const u of universities) {
        const match = ALL_SCHOOLS.find((s) => s.toLowerCase().includes(u.toLowerCase()))
        if (match && !pinned.includes(match)) pinned.push(match)
      }
    }
    if (pinned.length > 0) setPinnedSchools(pinned)
  }, [])

  const filtered = advisors.filter((a) => {
    const matchesCollege =
      collegeFilter === "all"
        ? pinnedSchools.length === 0 || pinnedSchools.includes(a.school)
        : a.school === collegeFilter
    const matchesQuery =
      !query ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.school.toLowerCase().includes(query.toLowerCase()) ||
      a.program.toLowerCase().includes(query.toLowerCase()) ||
      a.specialties.some((s) => s.toLowerCase().includes(query.toLowerCase()))
    return matchesCollege && matchesQuery
  })

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
            Academic <span style={{ color: "var(--brand)" }}>Advisors</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Connect with transfer advisors at Virginia institutions. These advisors can help you understand which of your classes count, and answer questions about the <TermTooltip termId="articulation-agreement">official transfer agreements</TermTooltip> between your schools.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          {pinnedSchools.length > 0 && collegeFilter === "all" && (
            <div
              className="mb-6 rounded-xl border px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
              style={{ borderColor: "oklch(0.72 0.14 196 / 0.35)", backgroundColor: "var(--brand-muted)" }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
                <span className="text-foreground font-medium">Showing advisors for your transfer path:</span>
                <span className="text-muted-foreground">{pinnedSchools.join(" → ")}</span>
              </div>
              <button
                className="text-xs underline text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                onClick={() => setPinnedSchools([])}
              >
                Show all
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, program, or specialty..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-56"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              aria-label="Filter by college"
            >
              <option value="all">All Colleges</option>
              {ALL_SCHOOLS.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No advisors found{query ? ` for "${query}"` : ""}{collegeFilter !== "all" ? ` at ${collegeFilter}` : ""}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((advisor, idx) => (
              <Card key={advisor.id} className="overflow-hidden hover:shadow-md transition-shadow border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                    >
                      {getInitials(advisor.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">{advisor.name}</h3>
                      <p className="text-xs text-muted-foreground leading-snug">{advisor.title}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                        style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
                      >
                        {advisor.school}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Program:</strong> {advisor.program}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="w-full gap-2 text-white text-xs"
                    style={{ background: "var(--brand-gradient)" }}
                    asChild
                  >
                    <a href={`mailto:${advisor.email}`}>
                      <Mail className="h-3.5 w-3.5" />
                      {getContactLabel(advisor.name, advisor.gender)}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center text-xs text-muted-foreground">
            <p>Showing {filtered.length} of {advisors.length} advisors &middot; Demo data only</p>
          </div>
        </div>
      </section>
    </div>
  )
}
