import { type DegreePlan, type DegreeRequirement } from "@/data/degrees"
import { type TransferAgreement, type CourseMapping } from "@/data/courses"
import { type CatalogCourse } from "@/data/courseCatalog"

export interface DegreeGapResult {
  completedCredits: number
  remainingCredits: number
  totalCredits: number
  completedRequirements: DegreeRequirement[]
  remainingRequirements: DegreeRequirement[]
  completedCourses: CatalogCourse[]
  unmatchedCompleted: CatalogCourse[]
}

export interface TransferResult {
  transferring: CourseMapping[]
  expanded: CourseMapping[]
  conditional: CourseMapping[]
  noEquiv: CourseMapping[]
  totalTransferCredits: number
}

export interface TargetDegreeGap {
  coveredByTransfer: DegreeRequirement[]
  remainingAtTarget: DegreeRequirement[]
  totalRemainingCredits: number
}

function courseCodeMatchesRequirement(courseCode: string, req: DegreeRequirement): boolean {
  const normalizedCode = courseCode.trim().toUpperCase()
  const normalizedReq = req.code.trim().toUpperCase()
  if (normalizedCode === normalizedReq) return true
  const reqSubject = normalizedReq.replace(/\s+\d+.*$/, "").trim()
  const courseSubject = normalizedCode.replace(/\s+\d+.*$/, "").trim()
  if (normalizedReq.includes("ELECTIVE") && reqSubject === courseSubject) return true
  return false
}

export function computeDegreeGap(
  degree: DegreePlan,
  completedCourses: CatalogCourse[]
): DegreeGapResult {
  const completedRequirements: DegreeRequirement[] = []
  const remainingRequirements: DegreeRequirement[] = []
  const matchedCourseIndices = new Set<number>()

  for (const req of degree.requirements) {
    const matchIndex = completedCourses.findIndex(
      (c, i) => !matchedCourseIndices.has(i) && courseCodeMatchesRequirement(c.code, req)
    )
    if (matchIndex !== -1) {
      completedRequirements.push(req)
      matchedCourseIndices.add(matchIndex)
    } else {
      remainingRequirements.push(req)
    }
  }

  const completedCredits = completedRequirements.reduce((sum, r) => sum + r.credits, 0)
  const remainingCredits = remainingRequirements.reduce((sum, r) => sum + r.credits, 0)
  const unmatchedCompleted = completedCourses.filter((_, i) => !matchedCourseIndices.has(i))

  return {
    completedCredits,
    remainingCredits,
    totalCredits: degree.totalCredits,
    completedRequirements,
    remainingRequirements,
    completedCourses,
    unmatchedCompleted,
  }
}

export function computeTransferResult(
  agreement: TransferAgreement,
  completedCourses: CatalogCourse[]
): TransferResult {
  const completedCodes = new Set(completedCourses.map((c) => c.code.trim().toUpperCase()))

  const relevantMappings = agreement.courses.filter((m) =>
    completedCodes.has(m.sourceCode.trim().toUpperCase())
  )

  const transferring = relevantMappings.filter((c) => c.status === "transfers")
  const expanded = relevantMappings.filter((c) => c.status === "expanded")
  const conditional = relevantMappings.filter((c) => c.status === "conditional")
  const noEquiv = relevantMappings.filter(
    (c) => c.status === "no-equivalent" || c.status === "conflict"
  )

  const totalTransferCredits = [...transferring, ...expanded].reduce(
    (sum, c) => sum + c.sourceCredits,
    0
  )

  return { transferring, expanded, conditional, noEquiv, totalTransferCredits }
}

export function computeTargetDegreeGap(
  targetDegree: DegreePlan,
  transferResult: TransferResult
): TargetDegreeGap {
  const allTransferredTargetCodes = new Set<string>()
  const allTransferred = [...transferResult.transferring, ...transferResult.expanded]
  for (const mapping of allTransferred) {
    for (const tc of mapping.targetCourses) {
      allTransferredTargetCodes.add(tc.code.trim().toUpperCase())
    }
  }

  const coveredByTransfer: DegreeRequirement[] = []
  const remainingAtTarget: DegreeRequirement[] = []

  for (const req of targetDegree.requirements) {
    const reqCode = req.code.trim().toUpperCase()
    if (allTransferredTargetCodes.has(reqCode)) {
      coveredByTransfer.push(req)
    } else {
      remainingAtTarget.push(req)
    }
  }

  const totalRemainingCredits = remainingAtTarget.reduce((sum, r) => sum + r.credits, 0)

  return { coveredByTransfer, remainingAtTarget, totalRemainingCredits }
}
