import { useState, useMemo } from "react"
import { Search, X, ArrowRight, ChevronLeft, ChevronDown, BookOpen, CircleCheck as CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getCoursesBySchool, groupCoursesBySubject, type CatalogCourse } from "@/data/courseCatalog"
import { cn } from "@/lib/utils"

interface Props {
  currentSchool: string
  completedCourses: CatalogCourse[]
  setCompletedCourses: (courses: CatalogCourse[]) => void
  onNext: () => void
  onBack: () => void
}

const SUBJECT_LABELS: Record<string, string> = {
  CSC: "Computer Science",
  MTH: "Mathematics",
  ENG: "English / Composition",
  BIO: "Biology",
  CHM: "Chemistry",
  PHY: "Physics",
  GOL: "Geology",
  HIS: "History",
  PHI: "Philosophy",
  REL: "Religion",
  ECO: "Economics",
  PSY: "Psychology",
  SOC: "Sociology",
  PLS: "Political Science",
  GEO: "Geography",
  ART: "Art History",
  MUS: "Music",
  EGR: "Engineering",
  ITE: "Information Technology",
  CST: "Communication / Speech",
  SDV: "Student Development",
}

function getSubjectLabel(subject: string): string {
  return SUBJECT_LABELS[subject] ?? subject
}

export function PlannerStep2({
  currentSchool,
  completedCourses,
  setCompletedCourses,
  onNext,
  onBack,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set(["CSC", "MTH"]))

  const allCourses = getCoursesBySchool(currentSchool)
  const completedCodes = new Set(completedCourses.map((c) => c.code))

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allCourses
    return allCourses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
    )
  }, [allCourses, searchQuery])

  const grouped = useMemo(() => groupCoursesBySubject(filteredCourses), [filteredCourses])
  const sortedSubjects = Object.keys(grouped).sort()

  const toggleCourse = (course: CatalogCourse) => {
    if (completedCodes.has(course.code)) {
      setCompletedCourses(completedCourses.filter((c) => c.code !== course.code))
    } else {
      setCompletedCourses([...completedCourses, course])
    }
  }

  const removeCourse = (code: string) => {
    setCompletedCourses(completedCourses.filter((c) => c.code !== code))
  }

  const toggleSubject = (subject: string) => {
    const next = new Set(openSubjects)
    if (next.has(subject)) next.delete(subject)
    else next.add(subject)
    setOpenSubjects(next)
  }

  const totalCompletedCredits = completedCourses.reduce((s, c) => s + c.credits, 0)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <Badge
          className="mb-4 text-xs font-semibold"
          style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
        >
          Transfer Planner
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Courses You've Completed</h1>
        <p className="text-muted-foreground leading-relaxed">
          Select every course you've already taken at {currentSchool}. Search by course code or name.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          <div className="flex-1 h-1.5 rounded-full bg-muted" />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-1">Step 2 of 3 — Completed Courses</p>
      </div>

      {completedCourses.length > 0 && (
        <Card className="mb-4" style={{ borderColor: "var(--brand)", backgroundColor: "var(--brand-muted)" }}>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2" style={{ color: "var(--brand)" }}>
              <CheckCircle2 className="h-4 w-4" />
              Selected Courses
              <Badge variant="secondary" className="ml-auto text-xs">
                {completedCourses.length} courses · {totalCompletedCredits} cr
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {completedCourses.map((course) => (
                <button
                  key={course.code}
                  onClick={() => removeCourse(course.code)}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "var(--brand-muted)",
                    borderColor: "oklch(0.72 0.14 196 / 0.4)",
                    color: "var(--brand)",
                  }}
                  title={`Remove ${course.code}`}
                >
                  {course.code}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by code (e.g. CSC 221) or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No courses match "{searchQuery}"
            </div>
          )}

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {sortedSubjects.map((subject) => {
              const courses = grouped[subject]
              const isOpen = searchQuery ? true : openSubjects.has(subject)
              const completedInGroup = courses.filter((c) => completedCodes.has(c.code)).length

              return (
                <Collapsible
                  key={subject}
                  open={isOpen}
                  onOpenChange={() => !searchQuery && toggleSubject(subject)}
                >
                  <CollapsibleTrigger
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                    disabled={!!searchQuery}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-semibold text-foreground flex-1">
                      {subject} — {getSubjectLabel(subject)}
                    </span>
                    {completedInGroup > 0 && (
                      <Badge
                        className="text-xs ml-1"
                        style={{
                          backgroundColor: "oklch(0.72 0.14 196 / 0.15)",
                          color: "var(--brand)",
                          border: "1px solid oklch(0.72 0.14 196 / 0.3)",
                        }}
                      >
                        {completedInGroup} selected
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{courses.length}</span>
                    {!searchQuery && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-muted-foreground transition-transform flex-shrink-0",
                          isOpen && "rotate-180"
                        )}
                      />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 space-y-1 pl-2">
                      {courses.map((course) => {
                        const selected = completedCodes.has(course.code)
                        return (
                          <button
                            key={course.code}
                            onClick={() => toggleCourse(course)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all",
                              selected
                                ? "border-[oklch(0.72_0.14_196_/_0.4)] bg-[oklch(0.72_0.14_196_/_0.08)]"
                                : "border-border bg-background hover:bg-muted/40"
                            )}
                          >
                            <div
                              className={cn(
                                "h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center transition-all",
                                selected
                                  ? "border-[var(--brand)] bg-[var(--brand)]"
                                  : "border-muted-foreground/40"
                              )}
                            >
                              {selected && (
                                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono font-bold text-sm text-foreground">{course.code}</span>
                                <span className="text-xs text-muted-foreground truncate">{course.name}</span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{course.credits} cr</span>
                          </button>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2 flex-shrink-0">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex-1 gap-2 text-white py-5 text-base"
          style={{ backgroundColor: "var(--brand)" }}
          onClick={onNext}
        >
          {completedCourses.length === 0
            ? "View Plan Without Completed Courses"
            : `View Transfer Plan (${completedCourses.length} courses selected)`}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
