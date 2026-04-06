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
      id: "section-2",
      title: "What do I need to qualify?",
      summary: "Earn an AA, AS, or AA&S degree with at least a 2.0 GPA. Complete 30 or more credits at your VCCS college. Earn a C or better in every course you plan to transfer. No SAT or ACT is required. Apply by June 1 for Fall or December 1 for Spring. Up to 90 credits can transfer.",
    },
    {
      id: "section-3",
      title: "Do I still have to take general education courses at VSU?",
      summary: "No — finishing your associate degree satisfies all lower-division general education requirements at VSU. You enter as a junior and go straight into your major. The only exception: if you earned a D or F in a gen-ed course, you may need to retake it.",
    },
    {
      id: "section-4",
      title: "I'm a dual enrollment student. Am I covered?",
      summary: "Yes. If you earn an associate degree at the same time as your high school diploma through a dual enrollment program, you are fully covered by this agreement.",
    },
    {
      id: "section-5",
      title: "Do AP, IB, CLEP, or military credits count?",
      summary: "Yes. Credits earned through AP, IB, CLEP, or military service (ACE/Joint Services) can count toward your associate degree for the purposes of this agreement. Make sure official transcripts are sent to VSU.",
    },
    {
      id: "section-6",
      title: "How long do I have to use this agreement?",
      summary: "VSU applies the course catalog from when you first enrolled at your VCCS college. You have up to four years from that first enrollment date to complete your degree and transfer under this agreement, as long as you stay continuously enrolled.",
    },
    {
      id: "section-7",
      title: "Does this guarantee admission to my specific major?",
      summary: "Not automatically. This agreement guarantees you a spot at VSU — but some programs (like Nursing or Education) have their own additional requirements. Check transfervirginia.org and search for your intended major to see if extra steps are needed.",
    },
  ],
  pdfPath: "/src/data/agreements/VSU.pdf",
}

export const VCCS_VCU_GAA: ArticulationAgreement = {
  id: "vccs-vcu-gaa-2023",
  title: "Transfer Agreement with Guaranteed Admission",
  type: "GAA",
  sourceSystem: "Virginia Community College System (VCCS)",
  sourceInstitutions: [
    "Brightpoint Community College",
    "Northern Virginia Community College (NOVA)",
    "All VCCS Member Colleges",
  ],
  targetInstitution: "Virginia Commonwealth University",
  targetInstitutionAbbreviation: "VCU",
  lastUpdated: "July 1, 2023",
  effectiveDate: "July 1, 2023",
  status: "current",
  admissionRequirements: {
    applicableDegrees: ["Associate of Arts (AA)", "Associate of Science (AS)", "Associate of Arts & Sciences (AA&S)"],
    minimumGPA: 2.5,
    minimumCreditsAtVCCS: 30,
    maximumTransferCredits: 90,
    testingRequired: false,
    applicationDeadlines: [
      { term: "Fall", deadline: "March 1" },
      { term: "Spring", deadline: "October 1" },
    ],
    courseGradeMinimum: "C",
  },
  keyBenefits: [
    "Guaranteed admission to VCU upon meeting requirements",
    "AA/AS/AA&S degree satisfies all lower-division general education at VCU",
    "No standardized testing (SAT/ACT) required",
    "Up to 90 credits accepted",
    "Dual enrollment students are eligible",
  ],
  sections: [
    {
      id: "section-1",
      title: "What This Agreement Covers",
      summary: "VCCS students who earn a qualifying transfer associate degree (AA, AS, or AA&S) and meet the GPA requirement (2.5) are guaranteed admission to VCU — but not necessarily to a specific program. Competitive programs like Nursing or Engineering may have additional requirements.",
    },
    {
      id: "section-2",
      title: "Admission Requirements",
      summary: "Earn an AA, AS, or AA&S with at least a 2.5 GPA. Complete 30+ credits at a VCCS college. Earn a C or better in every transferring course. Apply by March 1 for Fall or October 1 for Spring. No SAT or ACT needed.",
    },
    {
      id: "section-3",
      title: "How Your General Education Credits Transfer",
      summary: "Finishing your associate degree means VCU waives all lower-division general education requirements. You enter as a junior and focus on your major courses. If you earned a D or F in any gen-ed course, you may need to retake it.",
    },
    {
      id: "section-4",
      title: "Prior Learning & Dual Enrollment",
      summary: "AP, IB, CLEP, and military (ACE/Joint Services) credits count toward your associate degree for GAA purposes. Dual enrollment students earning an associate degree alongside a high school diploma are also covered.",
    },
    {
      id: "section-5",
      title: "Program-Specific Requirements",
      summary: "Admission to VCU is guaranteed; admission to specific competitive programs (e.g., Business, Health Sciences) is not. Check the Transfer Virginia portal for your intended major's transfer guide.",
    },
  ],
  pdfPath: "/src/data/agreements/VSU.pdf",
}

export const VCCS_GMU_GAA: ArticulationAgreement = {
  id: "vccs-gmu-gaa-2022",
  title: "Transfer Agreement with Guaranteed Admission",
  type: "GAA",
  sourceSystem: "Virginia Community College System (VCCS)",
  sourceInstitutions: [
    "Northern Virginia Community College (NOVA)",
    "Brightpoint Community College",
    "All VCCS Member Colleges",
  ],
  targetInstitution: "George Mason University",
  targetInstitutionAbbreviation: "GMU",
  lastUpdated: "August 15, 2022",
  effectiveDate: "August 15, 2022",
  status: "current",
  admissionRequirements: {
    applicableDegrees: ["Associate of Arts (AA)", "Associate of Science (AS)", "Associate of Arts & Sciences (AA&S)"],
    minimumGPA: 2.0,
    minimumCreditsAtVCCS: 30,
    maximumTransferCredits: 90,
    testingRequired: false,
    applicationDeadlines: [
      { term: "Fall", deadline: "March 15" },
      { term: "Spring", deadline: "November 1" },
    ],
    courseGradeMinimum: "C",
  },
  keyBenefits: [
    "Guaranteed admission to GMU for students meeting the 2.0 GPA requirement",
    "Associate degree satisfies all Mason Core (general education) requirements",
    "No SAT/ACT needed",
    "Dual enrollment and prior learning credit (AP, IB, CLEP) eligible",
    "Up to 90 transfer credits accepted",
  ],
  sections: [
    {
      id: "section-1",
      title: "What This Agreement Covers",
      summary: "Any VCCS student who earns a qualifying associate degree (AA, AS, or AA&S) and meets the 2.0 GPA minimum is guaranteed general admission to George Mason University. Program-specific majors (e.g., Computer Science, Nursing) may require a higher GPA or additional steps.",
    },
    {
      id: "section-2",
      title: "Admission Requirements",
      summary: "Earn an AA, AS, or AA&S degree with at least a 2.0 GPA. Complete 30+ credits at a VCCS school. Get a C or better in every course you want to transfer. Apply by March 15 for Fall or November 1 for Spring. No SAT or ACT required.",
    },
    {
      id: "section-3",
      title: "How Your General Education Credits Transfer",
      summary: "Completing your associate degree satisfies all Mason Core general education requirements at GMU. You'll enter as a junior ready to focus on your major. Courses where you earned a D or F do not count toward satisfying gen-ed.",
    },
    {
      id: "section-4",
      title: "Prior Learning & Dual Enrollment",
      summary: "AP, IB, CLEP, and military credits can count toward your degree for GAA eligibility. Dual enrollment students earning an associate degree while in high school are covered by this agreement.",
    },
    {
      id: "section-5",
      title: "Competitive Programs",
      summary: "GMU has selective programs (Computer Science, Business, Health Science) with higher GPA requirements. General admission is guaranteed at 2.0 GPA, but check Transfer Virginia or GMU's admissions page for your specific major.",
    },
  ],
  pdfPath: "/src/data/agreements/VSU.pdf",
}

export const ALL_AGREEMENTS: ArticulationAgreement[] = [VCCS_VSU_GAA, VCCS_VCU_GAA, VCCS_GMU_GAA]

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
