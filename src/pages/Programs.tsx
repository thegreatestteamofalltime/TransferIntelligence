import { useState } from "react"
import { GraduationCap, BookOpen, ArrowRight, Clock, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { degreePlans, type DegreePlan } from "@/data/degrees"
import { navigate } from "@/lib/router"

const associateDegrees = degreePlans.filter((p) =>
  p.degree.toLowerCase().includes("associate")
)

const bachelorDegrees = degreePlans.filter((p) =>
  p.degree.toLowerCase().includes("bachelor")
)

const categoryColors: Record<string, string> = {
  core: "var(--brand)",
  math: "oklch(0.55 0.18 250)",
  "general-ed": "oklch(0.55 0.15 145)",
  science: "oklch(0.55 0.18 60)",
  elective: "oklch(0.55 0.12 320)",
}

const categoryLabels: Record<string, string> = {
  core: "Core",
  math: "Math",
  "general-ed": "Gen Ed",
  science: "Science",
  elective: "Elective",
}

export function ProgramsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <Badge
          className="mb-4 text-xs font-semibold"
          style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
        >
          Degree Programs
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Programs</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Browse degree programs offered by colleges in our network. Expand any program to see full course requirements.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "var(--brand)" }}>
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Associate Degrees</h2>
            <p className="text-xs text-muted-foreground">A.S., A.A., A.A.S. and similar 2-year programs</p>
          </div>
        </div>
        <div className="grid gap-3">
          {associateDegrees.map((plan) => (
            <ProgramCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      <Separator className="mb-10" />

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "oklch(0.55 0.15 145)" }}>
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Bachelor Degrees</h2>
            <p className="text-xs text-muted-foreground">B.S., B.A. and similar 4-year programs</p>
          </div>
        </div>
        <div className="grid gap-3">
          {bachelorDegrees.map((plan) => (
            <ProgramCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-6 text-center"
        style={{ backgroundColor: "var(--brand-muted)" }}
      >
        <h3 className="font-semibold mb-2">Ready to map your courses?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use the Planner to see exactly how your community college courses transfer toward these degree programs.
        </p>
        <Button
          className="gap-2 text-white"
          style={{ backgroundColor: "var(--brand)" }}
          onClick={() => navigate("/planner")}
        >
          Start Transfer Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function ProgramCard({ plan }: { plan: DegreePlan }) {
  const [open, setOpen] = useState(false)

  const isAssociate = plan.degree.toLowerCase().includes("associate")
  const accentColor = isAssociate ? "var(--brand)" : "oklch(0.55 0.15 145)"
  const accentMuted = isAssociate ? "var(--brand-muted)" : "oklch(0.97 0.03 145)"

  const categoryCounts = plan.requirements.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + r.credits
    return acc
  }, {})

  const yearGroups = ["freshman", "sophomore", "junior", "senior"] as const
  const byYear = yearGroups
    .map((y) => ({
      year: y,
      courses: plan.requirements.filter((r) => r.year === y),
    }))
    .filter((g) => g.courses.length > 0)

  const noYear = plan.requirements.filter((r) => !r.year)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <CollapsibleTrigger asChild>
            <button className="w-full text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 font-bold text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {plan.abbreviation.substring(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm leading-tight">{plan.program}</span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      {plan.degree.match(/\(([^)]+)\)/)?.[1] ?? plan.degree}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.school}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{plan.totalCredits} cr</span>
                  </div>
                  <ChevronDown
                    className="h-4 w-4 text-muted-foreground transition-transform duration-200"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(categoryCounts).map(([cat, credits]) => (
                  <div
                    key={cat}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColors[cat] ?? "var(--muted-foreground)" }}
                  >
                    {categoryLabels[cat] ?? cat}
                    <span className="opacity-80">{credits}cr</span>
                  </div>
                ))}
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div style={{ backgroundColor: accentMuted }} className="px-5 py-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Course Requirements
              </p>

              <div className="space-y-4">
                {byYear.map(({ year, courses }) => (
                  <div key={year}>
                    <p className="text-xs font-semibold capitalize mb-2" style={{ color: accentColor }}>
                      {year} Year
                    </p>
                    <div className="space-y-1.5">
                      {courses.map((course, i) => (
                        <CourseRow key={`${course.code}-${i}`} course={course} />
                      ))}
                    </div>
                  </div>
                ))}
                {noYear.length > 0 && (
                  <div className="space-y-1.5">
                    {noYear.map((course, i) => (
                      <CourseRow key={`${course.code}-${i}`} course={course} />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Source: {plan.source}</p>
                <button
                  onClick={() => navigate("/planner")}
                  className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ color: accentColor }}
                >
                  Plan this degree
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  )
}

function CourseRow({ course }: { course: DegreePlan["requirements"][number] }) {
  const color = categoryColors[course.category] ?? "var(--muted-foreground)"

  return (
    <div className="flex items-start gap-2">
      <div
        className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono font-semibold text-foreground whitespace-nowrap">{course.code}</span>
          <span className="text-xs text-muted-foreground truncate">{course.name}</span>
        </div>
        {course.notes && (
          <p className="text-xs text-muted-foreground/70 mt-0.5 leading-snug">{course.notes}</p>
        )}
      </div>
      <span
        className="text-xs font-medium flex-shrink-0"
        style={{ color }}
      >
        {course.credits}cr
      </span>
    </div>
  )
}
