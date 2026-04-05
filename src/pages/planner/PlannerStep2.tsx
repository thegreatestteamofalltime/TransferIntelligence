import { useState, useMemo } from "react"
import {
  Search,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  CircleCheck as CheckCircle2,
  GraduationCap,
  FlaskConical,
  BookOpen,
  Calculator,
  Lightbulb,
  Users,
  Palette,
  History,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getCoursesBySchool, type CatalogCourse } from "@/data/courseCatalog"
import { type DegreePlan, type DegreeRequirement } from "@/data/degrees"
import { getRequiredCoursesForDegree } from "./plannerUtils"
import { cn } from "@/lib/utils"

interface Props {
  currentSchool: string
  currentDegree: DegreePlan
  completedCourses: CatalogCourse[]
  setCompletedCourses: (courses: CatalogCourse[]) => void
  onNext: () => void
  onBack: () => void
}

interface DegreeGroup {
  key: string
  label: string
  description: string
  icon: React.ReactNode
  requirements: DegreeRequirement[]
  availableCourses: CatalogCourse[]
  isChoiceGroup: boolean
}

function isChoicePlaceholder(code: string): boolean {
  const u = code.trim().toUpperCase()
  return (
    u.includes("ELECTIVE") ||
    u.includes("W/LAB") ||
    u.includes("APPROVED") ||
    u.includes("CHOOSE") ||
    u.startsWith("HUM ") ||
    u.startsWith("HUM/FA") ||
    u.startsWith("SOC/") ||
    u.startsWith("ARTS/") ||
    u === "LAB SCIENCE" ||
    u === "SCIENCE W/LAB" ||
    u === "SCIENCE W/LAB 1" ||
    u === "SCIENCE W/LAB 2" ||
    u === "SDV 100/101"
  )
}

function getCoursesForRequirement(req: DegreeRequirement, catalog: CatalogCourse[]): CatalogCourse[] {
  if (!isChoicePlaceholder(req.code)) {
    const match = catalog.find((c) => c.code.trim().toUpperCase() === req.code.trim().toUpperCase())
    return match ? [match] : []
  }

  const notes = (req.notes ?? "").toUpperCase()
  const name = req.name.toUpperCase()
  const u = req.code.trim().toUpperCase()

  if (u === "SDV 100/101") {
    return catalog.filter((c) => c.subject === "SDV")
  }
  if (u.startsWith("HIS") || notes.includes("HIS ")) {
    return catalog.filter((c) => c.subject === "HIS")
  }
  if (u.startsWith("HUM/FA") || name.includes("HUMANITIES/FINE ARTS")) {
    return catalog.filter((c) => ["ART", "MUS", "CST", "PHI", "REL", "HUM", "ENG"].includes(c.subject) && !["ENG 111", "ENG 112"].includes(c.code))
  }
  if (u.startsWith("HUM") || name.includes("HUMANITIES")) {
    return catalog.filter((c) => ["PHI", "REL", "ART", "MUS", "CST", "HUM"].includes(c.subject))
  }
  if (u.startsWith("SOC") || name.includes("SOCIAL") || name.includes("BEHAVIORAL")) {
    return catalog.filter((c) => ["ECO", "PSY", "SOC", "PLS", "GEO", "ADJ"].includes(c.subject))
  }
  if (u.startsWith("ARTS") || name.includes("ARTS/LIT")) {
    return catalog.filter((c) => ["ART", "CST", "MUS", "ENG"].includes(c.subject) && !["ENG 111", "ENG 112"].includes(c.code))
  }
  if (u.includes("SCIENCE") || u.includes("LAB") || name.includes("SCIENCE")) {
    return catalog.filter((c) => ["BIO", "CHM", "PHY", "GOL"].includes(c.subject))
  }
  if (u.includes("APPROVED") || name.includes("ELECTIVE")) {
    return catalog.filter((c) => ["CSC", "EGR", "MTH", "CST", "PHY", "BIO", "CHM", "GOL", "ITE"].includes(c.subject) && !["MTH 167", "MTH 263", "MTH 264", "CSC 221", "CSC 222", "CSC 223", "CSC 208", "CSC 205"].includes(c.code))
  }

  return []
}

function buildDegreeGroups(degree: DegreePlan, catalog: CatalogCourse[]): DegreeGroup[] {
  const categoryMeta: Record<string, { label: string; description: string; icon: React.ReactNode }> = {
    core: {
      label: "Core / Major Courses",
      description: "Required courses specific to your major",
      icon: <BookOpen className="h-4 w-4" />,
    },
    math: {
      label: "Mathematics",
      description: "Required mathematics coursework",
      icon: <Calculator className="h-4 w-4" />,
    },
    science: {
      label: "Science",
      description: "Lab science requirements",
      icon: <FlaskConical className="h-4 w-4" />,
    },
    "general-ed": {
      label: "General Education",
      description: "General education requirements",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    elective: {
      label: "Electives",
      description: "Approved elective credits",
      icon: <Star className="h-4 w-4" />,
    },
  }

  const genEdSubGroups: Record<string, { label: string; icon: React.ReactNode }> = {
    eng: { label: "English / Writing", icon: <BookOpen className="h-4 w-4" /> },
    his: { label: "History", icon: <History className="h-4 w-4" /> },
    hum: { label: "Humanities & Fine Arts", icon: <Palette className="h-4 w-4" /> },
    soc: { label: "Social & Behavioral Sciences", icon: <Users className="h-4 w-4" /> },
    arts: { label: "Arts & Literature", icon: <Palette className="h-4 w-4" /> },
    sdv: { label: "Student Development", icon: <GraduationCap className="h-4 w-4" /> },
  }

  function genEdSubKey(req: DegreeRequirement): string {
    const u = req.code.trim().toUpperCase()
    if (u === "SDV 100/101" || u.startsWith("SDV")) return "sdv"
    if (u.startsWith("ENG")) return "eng"
    if (u.startsWith("HIS")) return "his"
    if (u.startsWith("HUM/FA") || u.startsWith("HUM")) return "hum"
    if (u.startsWith("SOC/") || u.startsWith("SOC ")) return "soc"
    if (u.startsWith("ARTS/")) return "arts"
    return "eng"
  }

  const groupMap = new Map<string, DegreeGroup>()

  for (const req of degree.requirements) {
    const cat = req.category
    const isChoice = isChoicePlaceholder(req.code)

    let key: string
    let label: string
    let description: string
    let icon: React.ReactNode

    if (cat === "general-ed") {
      const subKey = genEdSubKey(req)
      key = `genEd-${subKey}`
      label = genEdSubGroups[subKey]?.label ?? "General Education"
      description = "General education requirement"
      icon = genEdSubGroups[subKey]?.icon ?? <Lightbulb className="h-4 w-4" />
    } else {
      key = cat
      label = categoryMeta[cat]?.label ?? cat
      description = categoryMeta[cat]?.description ?? ""
      icon = categoryMeta[cat]?.icon ?? <BookOpen className="h-4 w-4" />
    }

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        key,
        label,
        description,
        icon,
        requirements: [],
        availableCourses: [],
        isChoiceGroup: false,
      })
    }

    const group = groupMap.get(key)!
    group.requirements.push(req)
    if (isChoice) group.isChoiceGroup = true

    const coursesForReq = getCoursesForRequirement(req, catalog)
    for (const c of coursesForReq) {
      if (!group.availableCourses.find((e) => e.code === c.code)) {
        group.availableCourses.push(c)
      }
    }
  }

  const ORDER = ["core", "math", "science", "genEd-eng", "genEd-sdv", "genEd-his", "genEd-hum", "genEd-soc", "genEd-arts", "elective"]
  return [...groupMap.values()].sort((a, b) => {
    const ai = ORDER.indexOf(a.key)
    const bi = ORDER.indexOf(b.key)
    if (ai === -1 && bi === -1) return a.label.localeCompare(b.label)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

export function PlannerStep2({
  currentSchool,
  currentDegree,
  completedCourses,
  setCompletedCourses,
  onNext,
  onBack,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["core", "math"]))
  const [hasCompletedDegree, setHasCompletedDegree] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogInfo, setDialogInfo] = useState<{ added: number; choiceCount: number; electiveCount: number } | null>(null)

  const allCourses = getCoursesBySchool(currentSchool)
  const completedCodes = new Set(completedCourses.map((c) => c.code))

  const degreeGroups = useMemo(
    () => buildDegreeGroups(currentDegree, allCourses),
    [currentDegree, allCourses]
  )

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return degreeGroups
    return degreeGroups
      .map((g) => ({
        ...g,
        availableCourses: g.availableCourses.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.availableCourses.length > 0)
  }, [degreeGroups, searchQuery])

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

  const toggleGroup = (key: string) => {
    const next = new Set(openGroups)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setOpenGroups(next)
  }

  const handleDegreeCheckboxChange = (checked: boolean) => {
    setHasCompletedDegree(checked)
    if (!checked) return

    const { required, choiceCount, electiveCount } = getRequiredCoursesForDegree(currentDegree, currentSchool)
    const currentCodes = new Set(completedCourses.map((c) => c.code))
    const toAdd = required.filter((c) => !currentCodes.has(c.code))

    if (toAdd.length > 0 || choiceCount > 0 || electiveCount > 0) {
      const merged = [...completedCourses, ...toAdd]
      setCompletedCourses(merged)
      setDialogInfo({ added: toAdd.length, choiceCount, electiveCount })
      setShowDialog(true)
    }
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
          Courses are organized by your degree requirements. Select every course you've already taken.
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

      <Card className="mb-4">
        <CardContent className="px-4 py-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="completed-degree"
              checked={hasCompletedDegree}
              onCheckedChange={(v) => handleDegreeCheckboxChange(v === true)}
              className="mt-0.5"
            />
            <div className="flex flex-col gap-0.5 flex-1">
              <label
                htmlFor="completed-degree"
                className="text-sm font-semibold leading-snug cursor-pointer select-none"
              >
                I have completed my Associate Degree
              </label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Checking this will automatically select all required courses from your{" "}
                <span className="font-medium">{currentDegree.degree} in {currentDegree.program}</span>.
              </p>
            </div>
            <GraduationCap className="h-5 w-5 flex-shrink-0" style={{ color: "var(--brand)" }} />
          </div>
        </CardContent>
      </Card>

      {completedCourses.length > 0 && (
        <Card
          className="mb-4"
          style={{ borderColor: "oklch(0.72 0.14 196 / 0.35)", backgroundColor: "var(--brand-muted)" }}
        >
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2" style={{ color: "var(--brand)" }}>
              <CheckCircle2 className="h-4 w-4" />
              Selected Courses
              <Badge variant="secondary" className="ml-auto text-xs">
                {completedCourses.length} courses · {totalCompletedCredits} credits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {completedCourses.map((course) => (
                <button
                  key={course.code}
                  onClick={() => removeCourse(course.code)}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all hover:opacity-75"
                  style={{
                    backgroundColor: "oklch(0.72 0.14 196 / 0.12)",
                    borderColor: "oklch(0.72 0.14 196 / 0.35)",
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
              placeholder="Search by code (e.g. CSC 221) or course name..."
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

          {filteredGroups.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No courses match "{searchQuery}"
            </div>
          )}

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredGroups.map((group) => {
              const isOpen = searchQuery ? true : openGroups.has(group.key)
              const completedInGroup = group.availableCourses.filter((c) => completedCodes.has(c.code)).length
              const totalInGroup = group.availableCourses.length

              return (
                <Collapsible
                  key={group.key}
                  open={isOpen}
                  onOpenChange={() => !searchQuery && toggleGroup(group.key)}
                >
                  <CollapsibleTrigger
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                    disabled={!!searchQuery}
                  >
                    <span className="text-muted-foreground flex-shrink-0">{group.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-foreground">{group.label}</span>
                      {group.isChoiceGroup && (
                        <span className="ml-2 text-xs text-muted-foreground">— choose from list</span>
                      )}
                    </div>
                    {completedInGroup > 0 && (
                      <Badge
                        className="text-xs flex-shrink-0"
                        style={{
                          backgroundColor: "oklch(0.72 0.14 196 / 0.15)",
                          color: "var(--brand)",
                          border: "1px solid oklch(0.72 0.14 196 / 0.3)",
                        }}
                      >
                        {completedInGroup}/{totalInGroup}
                      </Badge>
                    )}
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
                      {group.requirements
                        .filter((req) => !isChoicePlaceholder(req.code))
                        .length > 0 && (
                        <div className="space-y-1">
                          {group.requirements
                            .filter((req) => !isChoicePlaceholder(req.code))
                            .map((req) => {
                              const course = group.availableCourses.find(
                                (c) => c.code.trim().toUpperCase() === req.code.trim().toUpperCase()
                              )
                              if (!course) return null
                              const selected = completedCodes.has(course.code)
                              return (
                                <CourseRow
                                  key={course.code}
                                  course={course}
                                  selected={selected}
                                  isRequired
                                  onClick={() => toggleCourse(course)}
                                />
                              )
                            })}
                        </div>
                      )}

                      {group.requirements
                        .filter((req) => isChoicePlaceholder(req.code))
                        .map((req, i) => {
                          const choiceCourses = getCoursesForRequirement(req, allCourses)
                          if (choiceCourses.length === 0) return null
                          return (
                            <div key={`${req.code}-${i}`} className="mt-2">
                              <div className="flex flex-wrap items-start gap-1 px-3 py-1.5 rounded bg-muted/50 mb-1">
                                <span className="text-xs font-medium text-muted-foreground">{req.name}</span>
                                {req.notes && (
                                  <span className="text-xs text-muted-foreground/60 leading-snug">— {req.notes}</span>
                                )}
                              </div>
                              <div className="space-y-1 pl-2">
                                {choiceCourses.map((course) => {
                                  const selected = completedCodes.has(course.code)
                                  return (
                                    <CourseRow
                                      key={course.code}
                                      course={course}
                                      selected={selected}
                                      isRequired={false}
                                      onClick={() => toggleCourse(course)}
                                    />
                                  )
                                })}
                              </div>
                            </div>
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

      <div className="mt-3 rounded-lg border bg-muted/30 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total credits selected</span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--brand)" }}>
          {totalCompletedCredits}
        </span>
      </div>

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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: "var(--brand-muted)" }}
            >
              <GraduationCap className="h-5 w-5" style={{ color: "var(--brand)" }} />
            </div>
            <DialogTitle>General Requirements Added</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  We automatically selected{" "}
                  <span className="font-semibold text-foreground">
                    {dialogInfo?.added} required course{dialogInfo?.added !== 1 ? "s" : ""}
                  </span>{" "}
                  from your {currentDegree.degree} in {currentDegree.program}.
                </p>
                {((dialogInfo?.choiceCount ?? 0) > 0 || (dialogInfo?.electiveCount ?? 0) > 0) && (
                  <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide">
                      Still needed from you
                    </p>
                    {(dialogInfo?.choiceCount ?? 0) > 0 && (
                      <div className="flex items-start gap-2">
                        <div
                          className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        <p>
                          <span className="font-medium text-foreground">Course choices</span> — your degree has{" "}
                          {dialogInfo?.choiceCount} area{(dialogInfo?.choiceCount ?? 0) > 1 ? "s" : ""} where you chose from a list
                          (e.g. History, Humanities, Social Sciences). Select the specific courses you completed.
                        </p>
                      </div>
                    )}
                    {(dialogInfo?.electiveCount ?? 0) > 0 && (
                      <div className="flex items-start gap-2">
                        <div
                          className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        <p>
                          <span className="font-medium text-foreground">Electives</span> — your degree includes{" "}
                          {dialogInfo?.electiveCount} elective slot{(dialogInfo?.electiveCount ?? 0) > 1 ? "s" : ""}. Select any
                          elective courses you completed.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full text-white"
              style={{ backgroundColor: "var(--brand)" }}
              onClick={() => setShowDialog(false)}
            >
              Got it, I'll add the rest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CourseRowProps {
  course: CatalogCourse
  selected: boolean
  isRequired: boolean
  onClick: () => void
}

function CourseRow({ course, selected, isRequired, onClick }: CourseRowProps) {
  return (
    <button
      onClick={onClick}
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-sm text-foreground">{course.code}</span>
          <span className="text-xs text-muted-foreground leading-snug">{course.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {isRequired && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-4 hidden sm:flex"
            style={{ borderColor: "oklch(0.72 0.14 196 / 0.3)", color: "var(--brand)" }}
          >
            req
          </Badge>
        )}
        <abbr title="credits" className="text-xs text-muted-foreground no-underline">{course.credits}</abbr>
      </div>
    </button>
  )
}
