import { type DegreePlan, type DegreeRequirement } from "@/data/degrees"
import { type TransferAgreement, type CourseMapping, getTransferMap } from "@/data/courses"
import { type CatalogCourse, getCoursesBySchool } from "@/data/courseCatalog"

function isChoicePlaceholder(code: string): boolean {
  const upper = code.toUpperCase()
  return (
    upper.includes("ELECTIVE") ||
    upper.includes("W/LAB") ||
    upper.includes("APPROVED") ||
    upper.includes("CHOOSE") ||
    upper.includes("HUM ") ||
    upper.includes("SOC/") ||
    upper.includes("ARTS/") ||
    upper === "HIS ELECTIVE" ||
    upper === "HUM ELECTIVE" ||
    upper === "SOC/BEH ELECTIVE" ||
    upper === "ARTS/LIT ELECTIVE" ||
    upper === "LAB SCIENCE" ||
    upper === "SCIENCE W/LAB" ||
    upper === "SCIENCE W/LAB 1" ||
    upper === "SCIENCE W/LAB 2" ||
    upper === "HUM/FA ELECTIVE" ||
    upper === "SDV 100/101"
  )
}

export function getRequiredCoursesForDegree(
  degree: DegreePlan,
  school: string
): { required: CatalogCourse[]; choiceCount: number; electiveCount: number } {
  const catalog = getCoursesBySchool(school)
  const catalogByCode = new Map(catalog.map((c) => [c.code.trim().toUpperCase(), c]))

  let choiceCount = 0
  let electiveCount = 0
  const required: CatalogCourse[] = []

  for (const req of degree.requirements) {
    if (isChoicePlaceholder(req.code)) {
      if (req.category === "elective") {
        electiveCount++
      } else {
        choiceCount++
      }
      continue
    }

    const catalogCourse = catalogByCode.get(req.code.trim().toUpperCase())
    if (catalogCourse) {
      required.push(catalogCourse)
    }
  }

  return { required, choiceCount, electiveCount }
}

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
  const transferMap = getTransferMap(agreement.id)

  const transferring: CourseMapping[] = []
  const expanded: CourseMapping[] = []
  const conditional: CourseMapping[] = []
  const noEquiv: CourseMapping[] = []

  for (const course of completedCourses) {
    const mapping = transferMap[course.code.trim().toUpperCase()]
    if (!mapping) continue
    if (mapping.status === "transfers") transferring.push(mapping)
    else if (mapping.status === "expanded") expanded.push(mapping)
    else if (mapping.status === "conditional") conditional.push(mapping)
    else if (mapping.status === "no-equivalent" || mapping.status === "conflict") noEquiv.push(mapping)
  }

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
  for (const mapping of [...transferResult.transferring, ...transferResult.expanded]) {
    for (const tc of mapping.targetCourses) {
      allTransferredTargetCodes.add(tc.code.trim().toUpperCase())
    }
  }

  const coveredByTransfer: DegreeRequirement[] = []
  const remainingAtTarget: DegreeRequirement[] = []

  for (const req of targetDegree.requirements) {
    if (allTransferredTargetCodes.has(req.code.trim().toUpperCase())) {
      coveredByTransfer.push(req)
    } else {
      remainingAtTarget.push(req)
    }
  }

  const totalRemainingCredits = remainingAtTarget.reduce((sum, r) => sum + r.credits, 0)

  return { coveredByTransfer, remainingAtTarget, totalRemainingCredits }
}
