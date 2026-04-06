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
  Users,
  Palette,
  History,
  Star,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
  iconColor: string
  bgClass: string
  textClass: string
  borderClass: string
  noteText: string
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

const CATEGORY_META: Record<string, {
  label: string
  description: string
  noteText: string
  iconColor: string
  bgClass: string
  textClass: string
  borderClass: string
  icon: React.ReactNode
}> = {
  core: {
    label: "Core / Major Courses",
    description: "Required courses specific to your major",
    noteText: "These are the required courses at the heart of your major — check off each one you've completed.",
    iconColor: "var(--brand)",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
  math: {
    label: "Mathematics",
    description: "Required mathematics coursework",
    noteText: "Calculus and discrete math courses — many can be completed at your community college before transferring.",
    iconColor: "oklch(0.55 0.18 250)",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    icon: <Calculator className="h-4 w-4 text-white" />,
  },
  science: {
    label: "Science",
    description: "Lab science requirements",
    noteText: "Lab science credits — check which ones you've already taken at your current school.",
    iconColor: "oklch(0.55 0.15 145)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    icon: <FlaskConical className="h-4 w-4 text-white" />,
  },
  "general-ed": {
    label: "General Education",
    description: "General education requirements",
    noteText: "Standard college-wide requirements — many of these transfer directly from your community college.",
    iconColor: "oklch(0.55 0.15 145)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
  elective: {
    label: "Electives",
    description: "Approved elective credits",
    noteText: "Select any approved elective courses you've already completed.",
    iconColor: "oklch(0.55 0.12 320)",
    bgClass: "bg-pink-50",
    textClass: "text-pink-700",
    borderClass: "border-pink-200",
    icon: <Star className="h-4 w-4 text-white" />,
  },
}

const GEN_ED_SUB_META: Record<string, {
  label: string
  iconColor: string
  bgClass: string
  textClass: string
  borderClass: string
  icon: React.ReactNode
}> = {
  eng: {
    label: "English / Writing",
    iconColor: "oklch(0.55 0.15 145)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
  his: {
    label: "History",
    iconColor: "oklch(0.55 0.14 55)",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
    icon: <History className="h-4 w-4 text-white" />,
  },
  hum: {
    label: "Humanities, Fine Arts & Literature",
    iconColor: "oklch(0.55 0.12 320)",
    bgClass: "bg-pink-50",
    textClass: "text-pink-700",
    borderClass: "border-pink-200",
    icon: <Palette className="h-4 w-4 text-white" />,
  },
  soc: {
    label: "Social & Behavioral Sciences",
    iconColor: "oklch(0.55 0.14 30)",
    bgClass: "bg-orange-50",
    textClass: "text-orange-700",
    borderClass: "border-orange-200",
    icon: <Users className="h-4 w-4 text-white" />,
  },
  arts: {
    label: "Arts & Literature",
    iconColor: "oklch(0.55 0.12 320)",
    bgClass: "bg-pink-50",
    textClass: "text-pink-700",
    borderClass: "border-pink-200",
    icon: <Palette className="h-4 w-4 text-white" />,
  },
  sdv: {
    label: "Student Development",
    iconColor: "var(--brand)",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    icon: <GraduationCap className="h-4 w-4 text-white" />,
  },
}

function genEdSubKey(req: DegreeRequirement): string {
  const u = req.code.trim().toUpperCase()
  if (u === "SDV 100/101" || u.startsWith("SDV")) return "sdv"
  if (u.startsWith("ENG")) return "eng"
  if (u.startsWith("HIS")) return "his"
  if (u.startsWith("HUM/FA") || u.startsWith("HUM")) return "hum"
  if (u.startsWith("SOC/") || u.startsWith("SOC ")) return "soc"
  if (u.startsWith("ARTS/")) return "hum"
  return "eng"
}

function buildDegreeGroups(degree: DegreePlan, catalog: CatalogCourse[]): DegreeGroup[] {
  const groupMap = new Map<string, DegreeGroup>()

  for (const req of degree.requirements) {
    const cat = req.category
    const isChoice = isChoicePlaceholder(req.code)

    let key: string
    let meta: typeof CATEGORY_META[string]

    if (cat === "general-ed") {
      const subKey = genEdSubKey(req)
      key = `genEd-${subKey}`
      meta = GEN_ED_SUB_META[subKey]
        ? { ...GEN_ED_SUB_META[subKey], description: "General education requirement", noteText: "Standard requirement — check the courses you've completed." }
        : { ...CATEGORY_META["general-ed"] }
    } else {
      key = cat
      meta = CATEGORY_META[cat] ?? CATEGORY_META["general-ed"]
    }

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        key,
        label: meta.label,
        description: meta.description,
        noteText: meta.noteText,
        iconColor: meta.iconColor,
        bgClass: meta.bgClass,
        textClass: meta.textClass,
        borderClass: meta.borderClass,
        icon: meta.icon,
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

  const ORDER = ["core", "math", "science", "genEd-eng", "genEd-sdv", "genEd-his", "genEd-hum", "genEd-soc", "elective"]
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
                <div key={group.key} className={cn("rounded-xl border overflow-hidden transition-all", group.borderClass)}>
                  <button
                    className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:brightness-95", group.bgClass)}
                    onClick={() => !searchQuery && toggleGroup(group.key)}
                    aria-expanded={isOpen}
                    disabled={!!searchQuery}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: group.iconColor }}
                    >
                      {group.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-sm font-semibold", group.textClass)}>{group.label}</span>
                        {group.isChoiceGroup && (
                          <span className="text-xs text-slate-500">— choose from list</span>
                        )}
                        {completedInGroup > 0 && (
                          <Badge
                            className="text-xs font-bold px-2 py-0 text-white border-0"
                            style={{ backgroundColor: group.iconColor }}
                          >
                            {completedInGroup}/{totalInGroup}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{group.description}</p>
                    </div>
                    {!searchQuery && (
                      <ChevronDown
                        className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", group.textClass)}
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    )}
                  </button>

                  {isOpen && (
                    <div className="bg-white dark:bg-background px-4 pt-3 pb-4">
                      <div className="flex gap-2 mb-3 p-2.5 rounded-lg bg-slate-100 dark:bg-muted/40">
                        <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                        <p className="text-xs text-slate-500 leading-relaxed">{group.noteText}</p>
                      </div>

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
                                iconColor={group.iconColor}
                                textClass={group.textClass}
                                bgClass={group.bgClass}
                                borderClass={group.borderClass}
                                onClick={() => toggleCourse(course)}
                              />
                            )
                          })}

                        {group.requirements
                          .filter((req) => isChoicePlaceholder(req.code))
                          .map((req, i) => {
                            const choiceCourses = getCoursesForRequirement(req, allCourses)
                            if (choiceCourses.length === 0) return null
                            return (
                              <div key={`${req.code}-${i}`} className="mt-2">
                                <div className={cn("flex flex-wrap items-start gap-1 px-3 py-1.5 rounded border mb-1", group.borderClass, group.bgClass)}>
                                  <span className={cn("text-xs font-medium", group.textClass)}>{req.name}</span>
                                  {req.notes && (
                                    <span className="text-xs text-slate-500 leading-snug">— {req.notes}</span>
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
                                        iconColor={group.iconColor}
                                        textClass={group.textClass}
                                        bgClass={group.bgClass}
                                        borderClass={group.borderClass}
                                        onClick={() => toggleCourse(course)}
                                      />
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
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
          style={{ background: "var(--brand-gradient)" }}
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
              style={{ background: "var(--brand-gradient)" }}
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
  iconColor: string
  textClass: string
  bgClass: string
  borderClass: string
  onClick: () => void
}

function CourseRow({ course, selected, isRequired, iconColor, textClass, bgClass, borderClass, onClick }: CourseRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all hover:brightness-95",
        selected ? borderClass : "border-border bg-background hover:bg-muted/40",
        selected ? bgClass : ""
      )}
    >
      <div
        className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all border"
        style={
          selected
            ? { backgroundColor: iconColor, borderColor: iconColor }
            : { borderColor: "oklch(0.6 0 0 / 0.4)" }
        }
      >
        {selected && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={cn("font-mono font-bold text-xs flex-shrink-0", selected ? textClass : "text-foreground")}>{course.code}</span>
          <span className="text-sm font-medium text-slate-800 leading-snug">{course.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {isRequired && (
          <Badge
            className="text-[10px] px-1.5 py-0 h-4 hidden sm:flex text-white border-0"
            style={{ backgroundColor: iconColor }}
          >
            req
          </Badge>
        )}
        <abbr title="credits" className={cn("text-xs font-bold tabular-nums no-underline", selected ? textClass : "text-muted-foreground")}>{course.credits}</abbr>
      </div>
    </button>
  )
}
