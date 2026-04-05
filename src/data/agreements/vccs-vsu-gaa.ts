export interface GAAAdmissionRequirements {
  applicableDegrees: string[]
  minimumGPA: number
  minimumCreditsAtVCCS: number
  maximumTransferCredits: number
  testingRequired: boolean
  applicationDeadlines: { term: string; deadline: string }[]
  courseGradeMinimum: string
}

export interface GAASection {
  id: string
  title: string
  summary: string
}

export interface ArticulationAgreement {
  id: string
  title: string
  type: "GAA" | "program-specific"
  sourceSystem: string
  sourceInstitutions: string[]
  targetInstitution: string
  targetInstitutionAbbreviation: string
  lastUpdated: string
  effectiveDate: string
  status: "current" | "pending-review" | "outdated"
  admissionRequirements: GAAAdmissionRequirements
  keyBenefits: string[]
  sections: GAASection[]
  pdfPath: string
}

export const VCCS_VSU_GAA: ArticulationAgreement = {
  id: "vccs-vsu-gaa-2023",
  title: "Transfer Agreement with Guaranteed Admission",
  type: "GAA",
  sourceSystem: "Virginia Community College System (VCCS)",
  sourceInstitutions: [
    "Brightpoint Community College",
    "Northern Virginia Community College (NOVA)",
    "All VCCS Member Colleges",
  ],
  targetInstitution: "Virginia State University",
  targetInstitutionAbbreviation: "VSU",
  lastUpdated: "March 28, 2023",
  effectiveDate: "March 28, 2023",
  status: "current",
  admissionRequirements: {
    applicableDegrees: ["Associate of Arts (AA)", "Associate of Science (AS)", "Associate of Arts & Sciences (AA&S)"],
    minimumGPA: 2.0,
    minimumCreditsAtVCCS: 30,
    maximumTransferCredits: 90,
    testingRequired: false,
    applicationDeadlines: [
      { term: "Fall", deadline: "June 1" },
      { term: "Spring", deadline: "December 1" },
    ],
    courseGradeMinimum: "C",
  },
  keyBenefits: [
    "Guaranteed admission to VSU upon meeting requirements",
    "Completion of an AA, AS, or AA&S transfer degree satisfies ALL lower-division general education requirements at VSU",
    "No standardized testing requirements",
    "Up to 90 credits transferable",
    "Applies to students earning an associate degree concurrently with a high school diploma (dual enrollment)",
    "Students with CLEP, IB, AP, or ACE/Joint Services credit are eligible",
    "VSU honors catalog requirements in effect at the time of first VCCS enrollment",
  ],
  sections: [
    {
      id: "section-1",
      title: "Definition of Guaranteed Admission Agreement (GAA)",
      summary: "An agreement guaranteeing admission to VSU for students who earn a qualifying transfer associate degree and meet academic benchmarks. General admission under the GAA does not guarantee admission to a specific program.",
    },
    {
      id: "section-2",
      title: "Requirements for Admission",
      summary: "Students must earn a qualifying AA, AS, or AA&S degree with a minimum 2.0 GPA, complete at least 30 credits at the VCCS institution, earn a grade of C or higher in all transferring courses, and apply by the published deadlines (Fall: June 1 / Spring: December 1). No standardized testing is required. A maximum of 90 credits may transfer.",
    },
    {
      id: "section-3",
      title: "Application of Associate Degree to General Education",
      summary: "Completion of an AA, AS, or AA&S transfer degree satisfies all lower-division general education requirements at VSU. Additional courses may be required for any general education courses where a grade of D or F was earned.",
    },
    {
      id: "section-4",
      title: "Dual Enrollment Students",
      summary: "The GAA applies to students who earn an associate degree concurrently with a high school diploma through a dual enrollment program.",
    },
    {
      id: "section-5",
      title: "Credit for Prior Learning",
      summary: "Students who complete the associate degree using CLEP, IB, AP, or ACE/Joint Services credit are eligible for the GAA and receive its benefits upon transfer. Official transcripts must be sent to VSU.",
    },
    {
      id: "section-6",
      title: "Catalog Determination",
      summary: "VSU honors the catalog in effect at the time of the student's first post-high school enrollment at the VCCS institution. Students have up to four years from their first enrollment under continuous enrollment.",
    },
    {
      id: "section-7",
      title: "Transfer Guide",
      summary: "Major-specific transfer guides are developed and featured at the Transfer Virginia portal (transfervirginia.org). Students should check the Transfer Guidance section to understand whether university admission also guarantees program admission.",
    },
    {
      id: "section-8",
      title: "Administration of Agreement",
      summary: "Administered by the VSU Director of Transfer Student Services and the VCCS Senior Vice Chancellor for Academic and Workforce Programs. The agreement remains in effect until modified or terminated by either party with one year's written notice.",
    },
    {
      id: "section-9",
      title: "Review Clause",
      summary: "VSU and VCCS review this agreement and student tracking data every three years to maintain integrity and improve the transfer process. Changes are not applied retroactively.",
    },
  ],
  pdfPath: "/src/data/agreements/VSU.pdf",
}

export const ALL_AGREEMENTS: ArticulationAgreement[] = [VCCS_VSU_GAA]

const VCCS_SCHOOLS = [
  "brightpoint", "nova", "northern virginia", "germanna", "reynolds", "tidewater",
  "piedmont", "lord fairfax", "rappahannock", "southwest", "wytheville",
  "mountain empire", "new river", "patrick henry", "central virginia", "dabney",
  "eastern shore", "virginia highlands", "virginiawestern", "john tyler",
  "blue ridge", "paul d", "southside",
]

export function isVCCSInstitution(schoolName: string): boolean {
  const lower = schoolName.toLowerCase()
  return VCCS_SCHOOLS.some((s) => lower.includes(s))
}

export function getAgreementForSchools(
  sourceSchool: string,
  targetSchool: string
): ArticulationAgreement | undefined {
  const sourceLower = sourceSchool.toLowerCase()
  const targetLower = targetSchool.toLowerCase()
  return ALL_AGREEMENTS.find((a) => {
    const targetMatch =
      a.targetInstitution.toLowerCase().includes(targetLower) ||
      a.targetInstitutionAbbreviation.toLowerCase() === targetLower
    const sourceMatch =
      a.sourceSystem.toLowerCase().includes(sourceLower) ||
      a.sourceInstitutions.some((inst) => inst.toLowerCase().includes(sourceLower))
    return targetMatch && sourceMatch
  })
}
