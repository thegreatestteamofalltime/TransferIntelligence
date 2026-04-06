import { Mail, Clock, Tag, Search, Users } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { advisors } from "@/data/advisors"
import { TermTooltip } from "@/components/TermTooltip"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((p) => !p.startsWith("Dr.") && p.length > 1)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
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

export function AdvisorsPage() {
  const [query, setQuery] = useState("")

  const filtered = advisors.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.school.toLowerCase().includes(query.toLowerCase()) ||
      a.program.toLowerCase().includes(query.toLowerCase()) ||
      a.specialties.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">

        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Academic Advisors</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Connect with transfer advisors at Virginia institutions. These advisors can help you understand which of your classes count, and answer questions about the <TermTooltip termId="articulation-agreement">official transfer agreements</TermTooltip> between your schools.
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, school, program, or specialty..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No advisors found for "{query}"</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((advisor, idx) => (
          <Card key={advisor.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  {advisor.availability}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <Tag className="h-3 w-3 flex-shrink-0" />
                  Specialties
                </div>
                <div className="flex flex-wrap gap-1">
                  {advisor.specialties.slice(0, 2).map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                  {advisor.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      +{advisor.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                className="w-full gap-2 text-white text-xs"
                style={{ backgroundColor: "var(--brand)" }}
                asChild
              >
                <a href={`mailto:${advisor.email}`}>
                  <Mail className="h-3.5 w-3.5" />
                  Contact {advisor.name.split(" ")[0]}
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
  )
}
