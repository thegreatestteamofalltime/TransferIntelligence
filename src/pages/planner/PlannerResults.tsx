import { useState } from "react"
import {
  CircleCheck as CheckCircle2,
  Circle as XCircle,
  TriangleAlert as AlertTriangle,
  CircleAlert as AlertCircle,
  ArrowRight,
  ChevronDown,
  Users,
  Lightbulb,
  RefreshCw,
  Info,
  BookOpen,
  Layers,
  FileText,
  ShieldCheck,
  GraduationCap,
  School,
  ListChecks,
  Clock,
} from "lucide-react"
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
  type ElectiveGroupDef,
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

function CourseCard({ mapping }: { mapping: CourseMapping }) {
  const [open, setOpen] = useState(false)
  const config = STATUS_CONFIG[mapping.status]
  const isExpanded = mapping.status === "expanded"
  const hasDetails = mapping.notes || mapping.conflictReason || mapping.alternativePathway

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}>
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${config.color}`}>{config.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
              <span className="font-bold text-sm text-foreground">{mapping.sourceCode}</span>
              <span className="text-xs text-muted-foreground">{mapping.sourceName}</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1" />
              {mapping.targetCourses.length === 0 ? (
                <span className="text-sm text-muted-foreground italic">No equivalent found</span>
              ) : isExpanded ? (
                <div className="space-y-1">
                  {mapping.targetCourses.map((tc) => (
                    <div key={tc.code} className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-foreground">{tc.code}</span>
                      <span className="text-xs text-muted-foreground">{tc.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-semibold text-sm text-foreground">{mapping.targetCourses[0].code}</span>
                  <span className="text-xs text-muted-foreground">{mapping.targetCourses[0].name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            <Badge className={`text-xs ${config.color} ${config.bg} border ${config.border} font-medium whitespace-nowrap`} variant="outline">
              {config.label}
            </Badge>
            <abbr title="credits" className="text-xs text-muted-foreground hidden sm:block no-underline">{mapping.sourceCredits}</abbr>
            {hasDetails && (
              <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </div>
      {hasDetails && open && (
        <div className="px-4 pb-4 pt-0 space-y-3">
          <Separator />
          {mapping.notes && (
            <div className="flex gap-2 text-sm">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <p className="text-muted-foreground text-xs leading-relaxed">{mapping.notes}</p>
            </div>
          )}
          {mapping.conflictReason && (
            <Alert className="py-2 border-destructive/40 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs"><strong>Issue: </strong>{mapping.conflictReason}</AlertDescription>
            </Alert>
          )}
          {mapping.alternativePathway && (
            <div className="flex gap-2 text-sm rounded-lg p-3" style={{ backgroundColor: "var(--brand-muted)", border: "1px solid oklch(0.72 0.14 196 / 0.3)" }}>
              <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
              <div>
                <p className="font-medium text-xs mb-0.5" style={{ color: "var(--brand)" }}>Suggestion</p>
                <p className="text-xs text-muted-foreground">{mapping.alternativePathway}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ElectiveGroupCard({ group, courses }: { group: ElectiveGroupDef; courses: CourseMapping[] }) {
  const [open, setOpen] = useState(false)
  const transferCount = courses.filter((c) => c.status === "transfers" || c.status === "expanded").length
  const needsReviewCount = courses.filter((c) => c.status === "conditional").length
  const noEquivCount = courses.filter((c) => c.status === "no-equivalent" || c.status === "conflict").length

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">{group.label}</span>
                  <Badge variant="secondary" className="text-xs">{courses.length} options</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {transferCount > 0 && <span className="text-success font-medium">{transferCount} transfer</span>}
                  {needsReviewCount > 0 && <span className="text-warning font-medium">{transferCount > 0 ? "· " : ""}{needsReviewCount} needs review</span>}
                  {noEquivCount > 0 && <span className="text-destructive font-medium">{(transferCount > 0 || needsReviewCount > 0) ? "· " : ""}{noEquivCount} no equivalent</span>}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            <Separator />
            <div className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <p>{group.description}</p>
            </div>
            <div className="space-y-2">
              {courses.map((course) => <CourseCard key={course.sourceCode} mapping={course} />)}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function RemainingDegreeCourses({
  currentDegree,
  remainingRequirements,
  remainingCredits,
}: {
  currentDegree: DegreePlan
  remainingRequirements: DegreeRequirement[]
  remainingCredits: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-6">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="rounded-xl border border-border overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0 text-warning" />
                <h2 className="font-semibold text-sm text-foreground flex-1">
                  Courses Still Needed for {currentDegree.abbreviation} Degree
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {remainingRequirements.length} courses · {remainingCredits} credits
                </Badge>
                <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                Complete these before transferring to finish your {currentDegree.degree} — {currentDegree.program}.
              </p>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-1.5">
              <Separator className="mb-3" />
              {remainingRequirements.map((req, i) => (
                <RequirementRow key={`${req.code}-${i}`} req={req} covered={false} />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
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

function AgreementBanner({ currentSchool }: { currentSchool: string }) {
  const gaa = VCCS_VSU_GAA
  if (!isVCCSInstitution(currentSchool)) return null

  return (
    <div
      className="mb-6 rounded-xl border p-4 flex items-start gap-3"
      style={{
        borderColor: "oklch(0.72 0.14 196 / 0.35)",
        backgroundColor: "var(--brand-muted)",
      }}
    >
      <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">Guaranteed Admission Agreement</span>
          <Badge
            variant="outline"
            className="text-xs"
            style={{ borderColor: "oklch(0.72 0.14 196 / 0.4)", color: "var(--brand)" }}
          >
            GAA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          As a VCCS student, you may qualify for guaranteed admission to VSU by completing your{" "}
          transfer associate degree (AA, AS, or AA&S) with a minimum {gaa.admissionRequirements.minimumGPA.toFixed(1)} GPA
          and at least {gaa.admissionRequirements.minimumCreditsAtVCCS} credits at your current institution.
          Completing your degree also satisfies all lower-division general education requirements at VSU.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Data last updated: <strong className="text-foreground ml-0.5">{gaa.lastUpdated}</strong>
          </span>
          <button
            onClick={() => navigate("/agreements")}
            className="text-xs font-medium flex items-center gap-1 hover:underline"
            style={{ color: "var(--brand)" }}
          >
            <FileText className="h-3 w-3" />
            View full agreement
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  currentSchool: string
  currentDegree: DegreePlan
  targetSchool: string
  targetDegree: DegreePlan
  program: string
  completedCourses: CatalogCourse[]
  agreement: TransferAgreement
  onEdit: () => void
}

export function PlannerResults({
  currentSchool,
  currentDegree,
  targetSchool,
  targetDegree,
  program,
  completedCourses,
  agreement,
  onEdit,
}: Props) {
  const degreeGap = computeDegreeGap(currentDegree, completedCourses)
  const transferResult = computeTransferResult(agreement, completedCourses)
  const targetGap = computeTargetDegreeGap(targetDegree, transferResult)

  const electiveGroups = agreement.electiveGroups ?? []
  const electiveGroupIds = new Set(electiveGroups.map((g) => g.id))
  const isElective = (c: CourseMapping) =>
    c.electiveGroupId !== undefined && electiveGroupIds.has(c.electiveGroupId)

  const transferring = transferResult.transferring.filter((c) => !isElective(c))
  const expanded = transferResult.expanded.filter((c) => !isElective(c))
  const conditional = transferResult.conditional.filter((c) => !isElective(c))
  const noEquiv = transferResult.noEquiv.filter((c) => !isElective(c))

  const hasCompletedCourses = completedCourses.length > 0
  const progressPct = Math.round((degreeGap.completedCredits / degreeGap.totalCredits) * 100)

  const getGroupCourses = (groupId: string) =>
    agreement.courses.filter((c) => c.electiveGroupId === groupId)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <Badge className="mb-2 text-xs font-semibold" style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}>
            Transfer Results
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Your Transfer Plan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {currentSchool} → {targetSchool} &middot; {program}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5 flex-shrink-0">
          <RefreshCw className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      <AgreementBanner currentSchool={currentSchool} />

      {agreement.status !== "current" && (
        <Alert className="mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {agreement.status === "outdated"
              ? "This transfer agreement may be outdated. Please confirm with an advisor."
              : "This agreement is pending review. Information may change."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4" style={{ color: "var(--brand)" }} />
            Current Degree Progress
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {currentDegree.degree} — {currentDegree.program} at {currentDegree.school}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--brand)" }}>
                {degreeGap.completedCredits}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Credits Completed</div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold text-warning">
                {degreeGap.remainingCredits}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Credits Remaining</div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold text-foreground">
                {degreeGap.totalCredits}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Total Required</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Degree completion</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          {!hasCompletedCourses && (
            <div className="text-center text-xs text-muted-foreground py-2 border border-dashed border-border rounded-lg">
              No courses selected — go back to Step 2 to add completed courses
            </div>
          )}
        </CardContent>
      </Card>

      {degreeGap.remainingRequirements.length > 0 && (
        <RemainingDegreeCourses
          currentDegree={currentDegree}
          remainingRequirements={degreeGap.remainingRequirements}
          remainingCredits={degreeGap.remainingCredits}
        />
      )}

      {hasCompletedCourses && (
        <>
          <div className="mb-2 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="h-4 w-4" style={{ color: "var(--brand)" }} />
              <h2 className="font-semibold text-sm text-foreground">Transfer Equivalency — Your Completed Courses</h2>
            </div>
            <p className="text-xs text-muted-foreground ml-6">How each of your completed courses counts at {targetSchool}.</p>
          </div>

          {transferring.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="font-semibold text-xs text-foreground">Transfers Directly</span>
                <Badge variant="secondary" className="text-xs ml-auto">{transferring.length} courses</Badge>
              </div>
              <div className="space-y-2">
                {transferring.map((c) => <CourseCard key={c.sourceCode} mapping={c} />)}
              </div>
            </div>
          )}

          {expanded.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-semibold text-xs text-foreground">Expanded Credit</span>
                <Badge variant="secondary" className="text-xs ml-auto">{expanded.length} courses</Badge>
              </div>
              <div className="space-y-2">
                {expanded.map((c) => <CourseCard key={c.sourceCode} mapping={c} />)}
              </div>
            </div>
          )}

          {conditional.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <span className="font-semibold text-xs text-foreground">Needs Advisor Review</span>
                <Badge variant="secondary" className="text-xs ml-auto">{conditional.length} courses</Badge>
              </div>
              <div className="space-y-2">
                {conditional.map((c) => <CourseCard key={c.sourceCode} mapping={c} />)}
              </div>
            </div>
          )}

          {noEquiv.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                <span className="font-semibold text-xs text-foreground">No Equivalent at {targetSchool}</span>
                <Badge variant="secondary" className="text-xs ml-auto">{noEquiv.length} courses</Badge>
              </div>
              <div className="space-y-2">
                {noEquiv.map((c) => <CourseCard key={c.sourceCode} mapping={c} />)}
              </div>
            </div>
          )}

          {electiveGroups.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold text-xs text-foreground">Elective Categories</span>
                <Badge variant="secondary" className="text-xs ml-auto">{electiveGroups.length} groups</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 ml-1">
                These are elective requirement categories for your degree. Expand each to see your options and transfer values.
              </p>
              <div className="space-y-2">
                {electiveGroups.map((group) => (
                  <ElectiveGroupCard
                    key={group.id}
                    group={group}
                    courses={getGroupCourses(group.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mb-6 mt-4">
        <Collapsible>
          <div className="rounded-xl border border-border overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
                  <h2 className="font-semibold text-sm text-foreground flex-1">
                    Remaining Courses at {targetSchool}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    {targetGap.remainingAtTarget.length} courses · {targetGap.totalRemainingCredits} credits
                  </Badge>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  Courses you'll need to complete at {targetSchool} to finish your {targetDegree.degree} — {targetDegree.program}.
                </p>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-1.5">
                <Separator className="mb-3" />
                {targetGap.coveredByTransfer.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-success mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Covered by your transfer credits ({targetGap.coveredByTransfer.length} courses)
                    </p>
                    <div className="space-y-1">
                      {targetGap.coveredByTransfer.map((req, i) => (
                        <RequirementRow key={`${req.code}-${i}`} req={req} covered />
                      ))}
                    </div>
                  </div>
                )}
                {targetGap.coveredByTransfer.length > 0 && targetGap.remainingAtTarget.length > 0 && (
                  <Separator className="my-3" />
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
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      <Card className="mb-6" style={{ borderColor: "var(--brand)", backgroundColor: "var(--brand-muted)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ color: "var(--brand)" }}>
            <Lightbulb className="h-4 w-4" />
            Suggested Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {degreeGap.remainingCredits > 0 && (
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
                You have <strong className="text-foreground mx-1">{degreeGap.remainingCredits} credits</strong> remaining to complete your {currentDegree.abbreviation} degree — finish these before transferring
              </li>
            )}
            {expanded.length > 0 && (
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
                Some courses count as <strong className="text-foreground mx-1">multiple credits</strong> at {targetSchool} — confirm with an advisor how they apply to your degree
              </li>
            )}
            {conditional.length > 0 && (
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
                Schedule an advisor meeting about your <strong className="text-foreground mx-1">needs review</strong> courses — they may still count with conditions
              </li>
            )}
            <li className="flex items-start gap-2">
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
              Bring your <strong className="text-foreground mx-1">unofficial transcript</strong> to your advising appointment
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brand)" }} />
              Contact a transfer advisor at <strong className="text-foreground mx-1">{targetSchool}</strong> to confirm this plan
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert className="mb-6 border-border bg-muted/40">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
          <strong>Important:</strong> Transfer equivalency is for reference only. Final transfer decisions are made by{" "}
          {targetSchool} after official transcript evaluation. Verify all results with an academic advisor before taking action.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="gap-2 text-white flex-1"
          style={{ backgroundColor: "var(--brand)" }}
          onClick={() => navigate("/advisors")}
        >
          <Users className="h-4 w-4" />
          Contact an Advisor
        </Button>
        <Button variant="outline" className="gap-2 flex-1" onClick={() => navigate("/terminology")}>
          <BookOpen className="h-4 w-4" />
          View Terminology
        </Button>
      </div>
    </div>
  )
}
