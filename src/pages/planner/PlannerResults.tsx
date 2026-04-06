import { useState, useRef } from "react"
import { CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, ArrowRight, ChevronDown, Users, Lightbulb, Info, BookOpen, Layers, FileText, ShieldCheck, GraduationCap, School, ListChecks, Clock, Circle as HelpCircle, MessageCircle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { navigate } from "@/lib/router"
import {
  type CourseMapping,
  type TransferStatus,
  type TransferAgreement,
} from "@/data/courses"
import { type DegreePlan, type DegreeRequirement } from "@/data/degrees"
import { type CatalogCourse } from "@/data/courseCatalog"
import {
  computeDegreeGap,
  computeTransferResult,
  computeTargetDegreeGap,
} from "./plannerUtils"
import { VCCS_VSU_GAA, isVCCSInstitution } from "@/data/agreements/vccs-vsu-gaa"
import { TransferVisualMap } from "./TransferVisualMap"

function openTransferBuddy(prompt?: string) {
  window.dispatchEvent(
    new CustomEvent("open-transfer-buddy", { detail: { prompt } })
  )
}

function ConceptTooltip({ label, concept }: { label: string; concept: string }) {
  return (
    <button
      onClick={() => openTransferBuddy(`Can you explain what "${concept}" means in plain language for a community college student?`)}
      className="inline-flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors underline-offset-2"
      title={`Ask TransferBuddy: What is ${concept}?`}
    >
      {label}
      <HelpCircle className="h-3 w-3 ml-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
    </button>
  )
}

const STATUS_CONFIG: Record<
  TransferStatus,
  { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  transfers: {
    label: "Transfers",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
  },
  expanded: {
    label: "Expanded Credit",
    icon: <Layers className="h-4 w-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "no-equivalent": {
    label: "No Equivalent",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
  },
  conditional: {
    label: "Needs Review",
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
  conflict: {
    label: "Policy Conflict",
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
  },
}

function CourseMapRow({ mapping }: { mapping: CourseMapping }) {
  const config = STATUS_CONFIG[mapping.status]
  const transfers = mapping.status === "transfers" || mapping.status === "expanded"
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left ${config.border} ${config.bg}`}>
      <div className={`flex-shrink-0 ${config.color}`}>{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-mono font-bold text-xs text-foreground">{mapping.sourceCode}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          {mapping.targetCourses.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No equivalent</span>
          ) : (
            <span className="font-mono font-bold text-xs text-foreground">{mapping.targetCourses.map(t => t.code).join(", ")}</span>
          )}
        </div>
        {mapping.notes && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{mapping.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge
          className={`text-[10px] px-1.5 py-0 h-4 border ${config.color} ${config.bg} ${config.border} whitespace-nowrap`}
          variant="outline"
        >
          {transfers ? "Transfers" : config.label}
        </Badge>
        <abbr title="credits" className="text-xs text-muted-foreground no-underline tabular-nums">{mapping.sourceCredits}</abbr>
      </div>
    </div>
  )
}

function RequirementRow({ req, covered }: { req: DegreeRequirement; covered: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${covered ? "border-success/30 bg-success/5" : "border-border bg-background"}`}>
      {covered
        ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
        : <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs font-bold text-foreground">{req.code}</span>
          <span className="text-xs text-muted-foreground leading-snug">{req.name}</span>
        </div>
        {req.notes && <p className="text-xs text-muted-foreground/70 mt-0.5 leading-snug">{req.notes}</p>}
      </div>
      <abbr title="credits" className="text-xs text-muted-foreground flex-shrink-0 no-underline">{req.credits}</abbr>
    </div>
  )
}

interface SectionDropdownProps {
  id: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  badge?: React.ReactNode
  defaultOpen?: boolean
  openRef?: React.RefObject<(() => void) | null>
  children: React.ReactNode
}

function SectionDropdown({ id, icon, title, subtitle, badge, defaultOpen, openRef, children }: SectionDropdownProps) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  if (openRef) {
    openRef.current = () => setOpen(true)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} id={id}>
      <div className="rounded-xl border border-border overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="font-semibold text-sm text-foreground flex-1">{title}</h2>
              {badge}
              <ChevronDown
                className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1 ml-6">{subtitle}</p>}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <Separator className="mb-3" />
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

interface Props {
  currentSchool: string
  currentDegree: DegreePlan
  targetSchool: string
  targetDegree: DegreePlan
  program?: string
  completedCourses: CatalogCourse[]
  agreement: TransferAgreement
  onEdit?: () => void
  onChangeProgram: () => void
  onChangeSchool: () => void
  onEditCourses: () => void
}

export function PlannerResults({
  currentSchool,
  currentDegree,
  targetSchool,
  targetDegree,
  completedCourses,
  agreement,
  onChangeProgram,
  onChangeSchool,
  onEditCourses,
}: Props) {
  const degreeGap = computeDegreeGap(currentDegree, completedCourses)
  const transferResult = computeTransferResult(agreement, completedCourses)
  const targetGap = computeTargetDegreeGap(targetDegree, transferResult)

  const electiveGroups = agreement.electiveGroups ?? []
  const electiveGroupIds = new Set(electiveGroups.map((g) => g.id))
  const isElective = (c: CourseMapping) =>
    c.electiveGroupId !== undefined && electiveGroupIds.has(c.electiveGroupId)

  const allTransferMappings = [
    ...transferResult.transferring.filter((c) => !isElective(c)),
    ...transferResult.expanded.filter((c) => !isElective(c)),
    ...transferResult.conditional.filter((c) => !isElective(c)),
    ...transferResult.noEquiv.filter((c) => !isElective(c)),
  ]

  const progressPct = Math.round((degreeGap.completedCredits / degreeGap.totalCredits) * 100)
  const isVCCS = isVCCSInstitution(currentSchool)
  const gaa = VCCS_VSU_GAA
  const isGuaranteed = isVCCS && degreeGap.remainingCredits === 0

  const completedCoursesRef = useRef<(() => void) | null>(null)
  const remainingCoursesRef = useRef<(() => void) | null>(null)
  const creditsMapRef = useRef<(() => void) | null>(null)
  const targetCoursesRef = useRef<(() => void) | null>(null)

  const scrollAndOpen = (ref: React.RefObject<(() => void) | null>, sectionId: string) => {
    ref.current?.()
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 80)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--brand)" }}>
          Transfer Plan
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Your Results Are Ready!</h1>
        <p className="text-muted-foreground text-sm">Here's a breakdown of how your credits transfer.</p>
      </div>

      {/* Visual Transfer Map */}
      <TransferVisualMap
        currentSchool={currentSchool}
        targetSchool={targetSchool}
        currentProgram={`${currentDegree.degree} — ${currentDegree.program}`}
        targetProgram={`${targetDegree.degree} — ${targetDegree.program}`}
      />

      {/* SECTION 1: Current Degree Progress */}
      <Card className="mb-4">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                {currentDegree.degree} — {currentDegree.program}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{currentSchool}</p>
            </div>
            <button
              onClick={onEditCourses}
              className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => scrollAndOpen(completedCoursesRef, "completed-courses")}
              className="rounded-xl border border-border bg-muted/30 p-3 text-center transition-all hover:border-current hover:bg-muted/60 group"
            >
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform" style={{ color: "var(--brand)" }}>
                {degreeGap.completedCredits}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">Credits Taken</div>
            </button>
            <button
              onClick={() => scrollAndOpen(remainingCoursesRef, "remaining-courses")}
              className="rounded-xl border border-border bg-muted/30 p-3 text-center transition-all hover:border-warning/50 hover:bg-warning/5 group"
            >
              <div className="text-2xl font-bold text-warning group-hover:scale-105 transition-transform">
                {degreeGap.remainingCredits}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">Remaining Credits</div>
            </button>
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{degreeGap.totalCredits}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                <ConceptTooltip label="Total Min. Credits" concept="minimum credit hours required for a degree" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Degree progress</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Completed Courses Dropdown */}
      <div className="mb-2" id="completed-courses">
        <SectionDropdown
          id="completed-courses-inner"
          icon={<CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />}
          title="Completed Courses"
          subtitle={`${completedCourses.length} courses you've already taken`}
          badge={<Badge variant="secondary" className="text-xs">{degreeGap.completedCredits} credits</Badge>}
          openRef={completedCoursesRef}
        >
          {completedCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No courses selected.{" "}
              <button onClick={onEditCourses} className="underline" style={{ color: "var(--brand)" }}>
                Go back to add courses
              </button>
            </p>
          ) : (
            <div className="space-y-1">
              {completedCourses.map((course) => (
                <div key={course.code} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-success/20 bg-success/5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex items-baseline gap-2">
                    <span className="font-mono font-bold text-xs text-foreground">{course.code}</span>
                    <span className="text-xs text-muted-foreground truncate">{course.name}</span>
                  </div>
                  <abbr title="credits" className="text-xs font-bold text-muted-foreground no-underline flex-shrink-0">{course.credits}</abbr>
                </div>
              ))}
            </div>
          )}
        </SectionDropdown>
      </div>

      {/* Remaining Current-School Courses Dropdown */}
      {degreeGap.remainingRequirements.length > 0 && (
        <div className="mb-4" id="remaining-courses">
          <SectionDropdown
            id="remaining-courses-inner"
            icon={<Clock className="h-4 w-4 text-warning flex-shrink-0" />}
            title={`Courses Needed to Complete Your ${currentDegree.abbreviation}`}
            subtitle={`Finish these at ${currentSchool} before you transfer`}
            badge={<Badge variant="secondary" className="text-xs">{degreeGap.remainingRequirements.length} courses · {degreeGap.remainingCredits} cr</Badge>}
            openRef={remainingCoursesRef}
          >
            <div className="space-y-1">
              {degreeGap.remainingRequirements.map((req, i) => (
                <RequirementRow key={`${req.code}-${i}`} req={req} covered={false} />
              ))}
            </div>
          </SectionDropdown>
        </div>
      )}

      {/* SECTION 2: Transfer Result — guaranteed or on track */}
      {isGuaranteed ? (
        <div className="mb-4 rounded-xl border p-5" style={{ borderColor: "oklch(0.72 0.14 196 / 0.4)", backgroundColor: "var(--brand-muted)" }}>
          <h2 className="text-xl font-extrabold mb-1" style={{ color: "var(--brand)" }}>
            Great news — your transfer is guaranteed!*
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            *Based on the most recent transfer agreement between {currentSchool} and {targetSchool}.
          </p>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            You've completed your associate degree. Under the Guaranteed Admission Agreement (GAA), you're guaranteed
            a spot at {targetSchool} — as long as you meet the GPA and credit requirements.
          </p>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
            <p>
              Always verify your transfer plan with an academic advisor before making any decisions. Transfer agreements
              can change, and individual circumstances vary.{" "}
              <button onClick={() => navigate("/advisors")} className="font-medium underline" style={{ color: "var(--brand)" }}>
                Find an advisor
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border p-5 bg-muted/30">
          <h2 className="text-xl font-extrabold mb-1 text-foreground">You're on the right track!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Finish the courses above and you'll be ready to transfer to {targetSchool}.
          </p>
          <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <p>
              Always verify your plan with an academic advisor.{" "}
              <button onClick={() => navigate("/advisors")} className="font-medium underline" style={{ color: "var(--brand)" }}>
                Find an advisor
              </button>
            </p>
          </div>
        </div>
      )}

      {/* GAA Info Button */}
      {isVCCS && (
        <button
          onClick={() => navigate("/agreements")}
          className="w-full mb-4 flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:bg-muted/50"
          style={{ borderColor: "oklch(0.72 0.14 196 / 0.35)", backgroundColor: "var(--brand-muted)" }}
        >
          <ShieldCheck className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">VCCS → VSU Guaranteed Admission Agreement</p>
            <p className="text-xs text-muted-foreground leading-snug">
              Min. {gaa.admissionRequirements.minimumGPA.toFixed(1)} GPA · {gaa.admissionRequirements.minimumCreditsAtVCCS}+ credits at VCCS · Transfer associate degree required
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">View</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                openTransferBuddy("What is a Guaranteed Admission Agreement (GAA) and how does it help me transfer?")
              }}
              className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              title="Ask TransferBuddy about GAA"
            >
              <HelpCircle className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
            </button>
          </div>
        </button>
      )}

      {/* SECTION 3: Target School */}
      <Card className="mb-4">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                {targetDegree.degree} — {targetDegree.program}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{targetSchool}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You're aiming to complete your bachelor's degree at {targetSchool}. Here's how your credits fit in.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => scrollAndOpen(creditsMapRef, "credits-map")}
              className="rounded-xl border border-border bg-muted/30 p-3 text-center transition-all hover:bg-muted/60 group"
            >
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform" style={{ color: "var(--brand)" }}>
                {transferResult.totalTransferCredits}
                <span className="text-sm font-normal text-muted-foreground">/{degreeGap.completedCredits}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                <ConceptTooltip label="Credits That Count" concept="transfer credit equivalency" />
              </div>
            </button>
            <button
              onClick={() => scrollAndOpen(targetCoursesRef, "target-courses")}
              className="rounded-xl border border-border bg-muted/30 p-3 text-center transition-all hover:bg-warning/5 hover:border-warning/40 group"
            >
              <div className="text-2xl font-bold text-warning group-hover:scale-105 transition-transform">
                {targetGap.totalRemainingCredits}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                Credits to Complete at {targetSchool.split(" ").pop()}
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* How Credits Map Out Dropdown */}
      <div className="mb-2" id="credits-map">
        <SectionDropdown
          id="credits-map-inner"
          icon={<ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />}
          title="How Credits Map Out"
          subtitle={`How your completed courses transfer to ${targetSchool}`}
          badge={<Badge variant="secondary" className="text-xs">{allTransferMappings.length} courses</Badge>}
          openRef={creditsMapRef}
        >
          {allTransferMappings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Complete courses in Step 2 to see your transfer map.</p>
          ) : (
            <div className="space-y-2">
              {transferResult.transferring.filter((c) => !isElective(c)).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-success mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Transfers Directly ({transferResult.transferring.filter(c => !isElective(c)).length})
                  </p>
                  <div className="space-y-1">
                    {transferResult.transferring.filter((c) => !isElective(c)).map((c) => (
                      <CourseMapRow key={c.sourceCode} mapping={c} />
                    ))}
                  </div>
                </div>
              )}
              {transferResult.expanded.filter((c) => !isElective(c)).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <ConceptTooltip label="Expanded Credit" concept="expanded credit transfer" />
                    {" "}({transferResult.expanded.filter(c => !isElective(c)).length})
                  </p>
                  <div className="space-y-1">
                    {transferResult.expanded.filter((c) => !isElective(c)).map((c) => (
                      <CourseMapRow key={c.sourceCode} mapping={c} />
                    ))}
                  </div>
                </div>
              )}
              {transferResult.conditional.filter((c) => !isElective(c)).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-warning mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Needs Advisor Review ({transferResult.conditional.filter(c => !isElective(c)).length})
                  </p>
                  <div className="space-y-1">
                    {transferResult.conditional.filter((c) => !isElective(c)).map((c) => (
                      <CourseMapRow key={c.sourceCode} mapping={c} />
                    ))}
                  </div>
                </div>
              )}
              {transferResult.noEquiv.filter((c) => !isElective(c)).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-destructive mb-1.5 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    No Equivalent at {targetSchool} ({transferResult.noEquiv.filter(c => !isElective(c)).length})
                  </p>
                  <div className="space-y-1">
                    {transferResult.noEquiv.filter((c) => !isElective(c)).map((c) => (
                      <CourseMapRow key={c.sourceCode} mapping={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionDropdown>
      </div>

      {/* Courses to Complete at Target School */}
      <div className="mb-6" id="target-courses">
        <SectionDropdown
          id="target-courses-inner"
          icon={<School className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />}
          title={`Courses to Take at ${targetSchool}`}
          subtitle={`Remaining courses you'll need to complete your degree at ${targetSchool}`}
          badge={
            <Badge variant="secondary" className="text-xs">
              {targetGap.remainingAtTarget.length} courses · {targetGap.totalRemainingCredits} cr
            </Badge>
          }
          openRef={targetCoursesRef}
        >
          {targetGap.coveredByTransfer.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-success mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Covered by your transfer ({targetGap.coveredByTransfer.length} courses)
              </p>
              <div className="space-y-1">
                {targetGap.coveredByTransfer.map((req, i) => (
                  <RequirementRow key={`${req.code}-${i}`} req={req} covered />
                ))}
              </div>
              {targetGap.remainingAtTarget.length > 0 && <Separator className="my-3" />}
            </div>
          )}
          {targetGap.remainingAtTarget.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <ListChecks className="h-3.5 w-3.5" />
                Still needed at {targetSchool} ({targetGap.remainingAtTarget.length} courses)
              </p>
              <div className="space-y-1">
                {targetGap.remainingAtTarget.map((req, i) => (
                  <RequirementRow key={`${req.code}-${i}`} req={req} covered={false} />
                ))}
              </div>
            </div>
          )}
        </SectionDropdown>
      </div>

      {/* Next Steps */}
      <Card className="mb-4" style={{ borderColor: "var(--brand)", backgroundColor: "var(--brand-muted)" }}>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: "var(--brand)" }}>
            <Lightbulb className="h-4 w-4" />
            Suggested Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {degreeGap.remainingCredits > 0 && (
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
                <span>You have <strong className="text-foreground">{degreeGap.remainingCredits} credits left</strong> at {currentSchool} — finish those before you transfer</span>
              </li>
            )}
            {transferResult.conditional.length > 0 && (
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
                <span>Some of your courses need advisor review — they might still count with conditions</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
              <span>Bring your <strong className="text-foreground">unofficial transcript</strong> to your advising appointment</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
              <span>
                Contact a transfer advisor at{" "}
                <button
                  onClick={() => navigate("/advisors", { college: currentSchool, universities: targetSchool })}
                  className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--brand)" }}
                >
                  {targetSchool}
                </button>
                {" "}to confirm this plan
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="mb-6 border-border bg-muted/40">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
          <strong>Heads up:</strong> This tool is for reference only. Final transfer decisions are made by {targetSchool} after reviewing your official transcripts. Always verify with an academic advisor before taking action.
        </AlertDescription>
      </Alert>

      {/* FAQ / Advisor / TransferBuddy buttons */}
      <p className="text-sm text-muted-foreground text-center mb-3 font-medium">Any additional questions?</p>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button variant="outline" className="gap-2 flex-1" onClick={() => navigate("/faq")}>
          <BookOpen className="h-4 w-4" />
          FAQ
        </Button>
        <Button
          className="gap-2 text-white flex-1"
          style={{ background: "var(--brand-gradient)" }}
          onClick={() => navigate("/advisors", { college: currentSchool, universities: targetSchool })}
        >
          <Users className="h-4 w-4" />
          Connect with Advisor
        </Button>
        <Button variant="outline" className="gap-2 flex-1" onClick={() => openTransferBuddy()}>
          <MessageCircle className="h-4 w-4" />
          TransferBuddy
        </Button>
      </div>

      {/* Change pathway links */}
      <div className="text-center space-y-2 py-4 border-t border-border">
        <p className="text-sm text-muted-foreground">Want to see how another program pathway would look?</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onChangeProgram}
            className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-foreground"
            style={{ color: "var(--brand)" }}
          >
            Change Your Program
          </button>
          <span className="text-muted-foreground text-xs">or</span>
          <button
            onClick={onChangeSchool}
            className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-foreground"
            style={{ color: "var(--brand)" }}
          >
            Change Your Target School
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Your completed courses will be saved — no need to re-enter them.</p>
      </div>
    </div>
  )
}
