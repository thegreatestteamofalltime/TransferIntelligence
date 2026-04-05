export type TransferStatus = "transfers" | "no-equivalent" | "conditional" | "conflict" | "expanded"

export interface TargetCourse {
  code: string
  name: string
  credits: number
}

export interface ElectiveGroupDef {
  id: string
  label: string
  description: string
  creditsRequired: number
  selectCount: number
}

export interface CourseMapping {
  sourceCode: string
  sourceName: string
  sourceCredits: number
  targetCourses: TargetCourse[]
  status: TransferStatus
  notes: string | null
  conflictReason: string | null
  alternativePathway: string | null
  lastUpdated: string
  electiveGroupId?: string
}

export interface TransferAgreement {
  id: string
  sourceSchool: string
  targetSchool: string
  program: string
  lastUpdated: string
  status: "current" | "pending-review" | "outdated"
  courses: CourseMapping[]
  electiveGroups?: ElectiveGroupDef[]
}

const BCC_ELECTIVE_GROUPS: ElectiveGroupDef[] = [
  {
    id: "bcc-lab-science",
    label: "Lab Science (Choose 2 sequences)",
    description: "Two semesters of laboratory science forming a sequence (e.g., BIO 101 + BIO 102, CHM 111 + CHM 112, or PHY 241 + PHY 242). All options transfer to VSU as BIOL/CHEM/PHYS laboratory science credit.",
    creditsRequired: 8,
    selectCount: 2,
  },
  {
    id: "bcc-history",
    label: "History Elective (Choose 1)",
    description: "One History course from the options below. All transfer to VSU as General Education History credit.",
    creditsRequired: 3,
    selectCount: 1,
  },
  {
    id: "bcc-humanities",
    label: "Humanities Elective (Choose 1)",
    description: "One Humanities course. PHI 220 (Ethics and Society) is highly recommended as it directly satisfies VSU's ethics requirement (PHIL 275).",
    creditsRequired: 3,
    selectCount: 1,
  },
  {
    id: "bcc-social-sciences",
    label: "Social/Behavioral Sciences Elective (Choose 1)",
    description: "One Social or Behavioral Sciences course. All listed options transfer to VSU as General Education Social Science credit.",
    creditsRequired: 3,
    selectCount: 1,
  },
  {
    id: "bcc-arts-lit",
    label: "Arts/Literature Elective (Choose 1)",
    description: "One Arts or Literature course. All listed options transfer to VSU as General Education Fine Arts or Literature credit.",
    creditsRequired: 3,
    selectCount: 1,
  },
  {
    id: "bcc-approved-electives",
    label: "Approved Electives (Choose from list)",
    description: "Approved elective courses to complete the degree. CSC 205, MTH 265, and MTH 266 are strongest as they satisfy specific VSU CS or math requirements.",
    creditsRequired: 3,
    selectCount: 1,
  },
]

const NOVA_ELECTIVE_GROUPS: ElectiveGroupDef[] = [
  {
    id: "nova-history",
    label: "History Elective (Choose 1)",
    description: "NOVA requires one History elective in the 1st semester. Any standard VCCS HIS course satisfies this requirement and transfers to VSU as General Education History credit.",
    creditsRequired: 3,
    selectCount: 1,
  },
  {
    id: "nova-humanities",
    label: "Humanities/Fine Arts Electives (Choose 2 from different areas)",
    description: "Two Humanities/Fine Arts electives from at least two of three areas: Fine Arts, Humanities, and Literature. PHI 220 (Ethics and Society) also satisfies VSU's PHIL 275 requirement.",
    creditsRequired: 6,
    selectCount: 2,
  },
  {
    id: "nova-social-sciences",
    label: "Social/Behavioral Sciences Elective (Choose 1)",
    description: "One Social/Behavioral Sciences elective. Eligible: ECO, GEO, PLS, PSY, and SOC — all transfer to VSU as General Education Social Science credit.",
    creditsRequired: 3,
    selectCount: 1,
  },
  {
    id: "nova-lab-science",
    label: "Lab Science (Choose 2 forming a sequence)",
    description: "Two semesters of laboratory science forming a coherent sequence (e.g., PHY 241 + PHY 242, BIO 101 + BIO 102, or CHM 111 + CHM 112). PHY 241/242 is the strongest sequence for CS students.",
    creditsRequired: 8,
    selectCount: 2,
  },
  {
    id: "nova-approved-electives",
    label: "Approved Elective (Choose 1)",
    description: "4th semester approved elective. CSC 205 (Computer Organization) directly satisfies a VSU core CS requirement. MTH 265 and MTH 266 satisfy VSU's Math Restricted Elective.",
    creditsRequired: 3,
    selectCount: 1,
  },
]

const BRIGHTPOINT_VSU_CS_COURSES: CourseMapping[] = [
  { sourceCode: "SDV 100", sourceName: "College Success Skills", sourceCredits: 1, targetCourses: [{ code: "TRAN 100", name: "College Success Skills", credits: 1 }], status: "transfers", notes: "Transfers as transition/elective credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "ENG 111", sourceName: "College Composition I", sourceCredits: 3, targetCourses: [{ code: "ENGL 110", name: "Composition I", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU ENGL 110.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "ENG 112", sourceName: "College Composition II", sourceCredits: 3, targetCourses: [{ code: "ENGL 111", name: "Composition II", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU ENGL 111.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 263", sourceName: "Calculus I", sourceCredits: 4, targetCourses: [{ code: "MATH 260", name: "Calculus I", credits: 4 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU MATH 260.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 264", sourceName: "Calculus II", sourceCredits: 4, targetCourses: [{ code: "MATH 261", name: "Calculus II", credits: 4 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU MATH 261.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 221", sourceName: "Introduction to Problem Solving and Programming", sourceCredits: 3, targetCourses: [{ code: "CSCI 150", name: "Programming I", credits: 3 }], status: "transfers", notes: "Transfers as CSCI 150 only — no lab credit. Consider CSC 222 for stronger alignment.", conflictReason: null, alternativePathway: "Consider completing CSC 222 — it maps to three VSU courses including the lab.", lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 222", sourceName: "Object-Oriented Programming", sourceCredits: 4, targetCourses: [{ code: "CSCI 150", name: "Programming I", credits: 3 }, { code: "CSCI 151", name: "Programming 1 Lab", credits: 1 }, { code: "ENGR 204", name: "Intro to Object Oriented Programming", credits: 4 }], status: "expanded", notes: "Expands into multiple components at VSU including an engineering course credit.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 205", sourceName: "Computer Organization", sourceCredits: 3, targetCourses: [{ code: "CSCI 303", name: "Computer Org & Architecture", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU CSCI 303.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 223", sourceName: "Data Structures and Analysis of Algorithms", sourceCredits: 4, targetCourses: [{ code: "CSCI 250", name: "Programming II", credits: 3 }, { code: "CSCI 251", name: "Programming II Lab", credits: 1 }], status: "expanded", notes: "Expands into lecture (3 cr) and lab (1 cr) at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 208", sourceName: "Introduction to Discrete Structures", sourceCredits: 3, targetCourses: [{ code: "CSCI 281", name: "Discrete Structures", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU CSCI 281.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "BIO 101", sourceName: "General Biology I", sourceCredits: 4, targetCourses: [{ code: "BIOL 120", name: "Principles of Biology I", credits: 3 }, { code: "BIOL 120L", name: "Principles of Biology I Lab", credits: 1 }], status: "expanded", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "BIO 102", sourceName: "General Biology II", sourceCredits: 4, targetCourses: [{ code: "BIOL 121", name: "Principles of Biology II", credits: 3 }, { code: "BIOL 121L", name: "Principles of Biology II Lab", credits: 1 }], status: "expanded", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "CHM 111", sourceName: "General Chemistry I", sourceCredits: 4, targetCourses: [{ code: "CHEM 151", name: "General Chemistry I", credits: 3 }, { code: "CHEM 153", name: "General Chemistry I Laboratory", credits: 1 }], status: "expanded", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "CHM 112", sourceName: "General Chemistry II", sourceCredits: 4, targetCourses: [{ code: "CHEM 152", name: "General Chemistry II", credits: 3 }, { code: "CHEM 154", name: "General Chemistry II Laboratory", credits: 1 }], status: "expanded", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "PHY 201", sourceName: "General College Physics I", sourceCredits: 4, targetCourses: [{ code: "PHYS 112", name: "General Physics I", credits: 4 }], status: "transfers", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "PHY 202", sourceName: "General College Physics II", sourceCredits: 4, targetCourses: [{ code: "PHYS 113", name: "General Physics II", credits: 4 }], status: "transfers", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "PHY 241", sourceName: "University Physics I", sourceCredits: 4, targetCourses: [{ code: "PHYS 112", name: "General Physics I", credits: 4 }], status: "transfers", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "PHY 242", sourceName: "University Physics II", sourceCredits: 4, targetCourses: [{ code: "PHYS 113", name: "General Physics II", credits: 4 }], status: "transfers", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-lab-science" },
  { sourceCode: "HIS 101", sourceName: "Western Civilizations Pre-1600 CE", sourceCredits: 3, targetCourses: [{ code: "HIST 114", name: "World History to 1500", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint History requirement. Transfers as GE History at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-history" },
  { sourceCode: "HIS 102", sourceName: "Western Civilizations Post-1600 CE", sourceCredits: 3, targetCourses: [{ code: "HIST 115", name: "World History Since 1500", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint History requirement. Transfers as GE History at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-history" },
  { sourceCode: "HIS 121", sourceName: "United States History to 1877", sourceCredits: 3, targetCourses: [{ code: "HIST 122", name: "U.S. History to 1865", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint History requirement. Transfers as GE History at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-history" },
  { sourceCode: "HIS 122", sourceName: "United States History Since 1865", sourceCredits: 3, targetCourses: [{ code: "HIST 123", name: "U.S. History After 1865", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint History requirement. Transfers as GE History at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-history" },
  { sourceCode: "PHI 100", sourceName: "Introduction to Philosophy", sourceCredits: 3, targetCourses: [{ code: "PHIL 140", name: "Philosophy", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Humanities requirement. Transfers as GE Humanities at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-humanities" },
  { sourceCode: "PHI 111", sourceName: "Logic", sourceCredits: 3, targetCourses: [{ code: "PHIL 220", name: "Introduction to Logic", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Humanities requirement. Transfers as GE Humanities at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-humanities" },
  { sourceCode: "PHI 220", sourceName: "Ethics and Society", sourceCredits: 3, targetCourses: [{ code: "PHIL 275", name: "Ethics", credits: 3 }], status: "transfers", notes: "Directly maps to VSU Sophomore Year Ethics requirement (PHIL 275).", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-humanities" },
  { sourceCode: "REL 100", sourceName: "Introduction to the Study of Religion", sourceCredits: 3, targetCourses: [{ code: "SOCI 314", name: "Sociology of Religion", credits: 3 }], status: "conditional", notes: "Transfers to VSU as a Sociology elective, not necessarily as Humanities. Confirm with VSU advisor.", conflictReason: null, alternativePathway: "PHI 220 (Ethics and Society) is often the best Humanities pick for CS students.", lastUpdated: "2024-08-01", electiveGroupId: "bcc-humanities" },
  { sourceCode: "REL 230", sourceName: "Religions of the World", sourceCredits: 3, targetCourses: [{ code: "TRAN 230", name: "Religions of the World", credits: 3 }], status: "conditional", notes: "Transfers as a transition credit at VSU. Confirm how this satisfies GE Humanities.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-humanities" },
  { sourceCode: "ECO 201", sourceName: "Principles of Macroeconomics", sourceCredits: 3, targetCourses: [{ code: "ECON 211", name: "Principles of Macroeconomics", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Social/Behavioral Sciences requirement. Transfers as GE Social Science at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-social-sciences" },
  { sourceCode: "ECO 202", sourceName: "Principles of Microeconomics", sourceCredits: 3, targetCourses: [{ code: "ECON 210", name: "Principles of Microeconomics", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Social/Behavioral Sciences requirement. Transfers as GE Social Science at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-social-sciences" },
  { sourceCode: "PSY 200", sourceName: "Principles of Psychology", sourceCredits: 3, targetCourses: [{ code: "PSYC 110", name: "Introduction to Psychology I", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Social/Behavioral Sciences requirement. Transfers as GE Social Science at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-social-sciences" },
  { sourceCode: "SOC 200", sourceName: "Introduction to Sociology", sourceCredits: 3, targetCourses: [{ code: "SOCI 101", name: "Introduction to Sociology", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Social/Behavioral Sciences requirement. Transfers as GE Social Science at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-social-sciences" },
  { sourceCode: "PLS 135", sourceName: "U.S. Government and Politics", sourceCredits: 3, targetCourses: [{ code: "POLI 150", name: "United States Government", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Social/Behavioral Sciences requirement. Transfers as GE Social Science at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-social-sciences" },
  { sourceCode: "ART 101", sourceName: "History of Art: Prehistoric to Gothic", sourceCredits: 3, targetCourses: [{ code: "ARTS 301", name: "World Art Survey I", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Arts/Literature requirement. Transfers as GE Fine Arts at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-arts-lit" },
  { sourceCode: "MUS 121", sourceName: "Music in Society", sourceCredits: 3, targetCourses: [{ code: "MUSI 199", name: "Music Appreciation", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Arts/Literature requirement. Transfers as GE Fine Arts at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-arts-lit" },
  { sourceCode: "ENG 245", sourceName: "British Literature", sourceCredits: 3, targetCourses: [{ code: "ENGL 210", name: "British Literature I", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Arts/Literature requirement. Transfers as GE Literature at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-arts-lit" },
  { sourceCode: "ENG 246", sourceName: "American Literature", sourceCredits: 3, targetCourses: [{ code: "ENGL 212", name: "American Literature I", credits: 3 }], status: "transfers", notes: "Satisfies Brightpoint Arts/Literature requirement. Transfers as GE Literature at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-arts-lit" },
  { sourceCode: "CSC 195", sourceName: "AI Foundations for Computer Science", sourceCredits: 3, targetCourses: [], status: "no-equivalent", notes: null, conflictReason: "CSC 195 does not have a confirmed direct equivalent at VSU.", alternativePathway: "Check with a VSU advisor — may count as a general or restricted elective.", lastUpdated: "2026-04-05", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "EGR 121", sourceName: "Foundations of Engineering", sourceCredits: 2, targetCourses: [{ code: "ENGR 101", name: "Introduction to Engineering I", credits: 2 }], status: "transfers", notes: "Transfers to VSU as Engineering I credit.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "EGR 122", sourceName: "Engineering Design", sourceCredits: 3, targetCourses: [{ code: "INLT 161", name: "Engineering Graphics I", credits: 3 }], status: "transfers", notes: "Transfers as Engineering Graphics credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "EGR 270", sourceName: "Fundamentals of Computer Engineering", sourceCredits: 4, targetCourses: [], status: "conditional", notes: "Transfer equivalency at VSU is not confirmed — verify with a VSU advisor.", conflictReason: null, alternativePathway: "May count as a restricted or unrestricted elective in the VSU CS program.", lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "MTH 265", sourceName: "Calculus III", sourceCredits: 4, targetCourses: [{ code: "MATH 360", name: "Calculus III", credits: 4 }], status: "transfers", notes: "Satisfies the MATH Restricted Elective requirement at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "MTH 266", sourceName: "Linear Algebra", sourceCredits: 3, targetCourses: [{ code: "MATH 325", name: "Linear Algebra", credits: 3 }], status: "transfers", notes: "Satisfies the MATH Restricted Elective requirement at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "ITE 152", sourceName: "Introduction to Digital Literacy and Computer Applications", sourceCredits: 3, targetCourses: [{ code: "COBU 155", name: "Information Systems & Tech I", credits: 3 }], status: "conditional", notes: "Transfers to a business/IT elective at VSU. May not count toward the CS major directly.", conflictReason: null, alternativePathway: "Confirm with VSU CS advisor whether this satisfies any degree requirement.", lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "CST 100", sourceName: "Principles of Public Speaking", sourceCredits: 3, targetCourses: [{ code: "SPEE 214", name: "Introduction to Public Speaking", credits: 3 }], status: "transfers", notes: "Transfers as Speech/Communication credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
  { sourceCode: "CST 110", sourceName: "Introduction to Human Communication", sourceCredits: 3, targetCourses: [{ code: "SPEE 214", name: "Introduction to Public Speaking", credits: 3 }], status: "transfers", notes: "Transfers as Speech/Communication credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "bcc-approved-electives" },
]

const NOVA_VSU_CS_COURSES: CourseMapping[] = [
  { sourceCode: "SDV 100", sourceName: "College Success Skills", sourceCredits: 1, targetCourses: [{ code: "TRAN 100", name: "College Success Skills", credits: 1 }], status: "transfers", notes: "Transfers as transition/elective credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "SDV 101", sourceName: "New Student Orientation", sourceCredits: 1, targetCourses: [{ code: "TRAN 101", name: "New Student Orientation", credits: 1 }], status: "transfers", notes: "Transfers as transition/elective credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "ENG 111", sourceName: "College Composition I", sourceCredits: 3, targetCourses: [{ code: "ENGL 110", name: "Composition I", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU ENGL 110.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "ENG 112", sourceName: "College Composition II", sourceCredits: 3, targetCourses: [{ code: "ENGL 111", name: "Composition II", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU ENGL 111.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 167", sourceName: "PreCalculus with Trigonometry", sourceCredits: 5, targetCourses: [{ code: "MATH 150", name: "Precalculus", credits: 4 }], status: "transfers", notes: "Preparatory course only — VSU's CS degree requires Calculus I, so MTH 263 is still needed.", conflictReason: null, alternativePathway: "After completing MTH 167, take MTH 263 (Calculus I) at NOVA, which transfers to VSU as MATH 260.", lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 263", sourceName: "Calculus I", sourceCredits: 4, targetCourses: [{ code: "MATH 260", name: "Calculus I", credits: 4 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU MATH 260.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 264", sourceName: "Calculus II", sourceCredits: 4, targetCourses: [{ code: "MATH 261", name: "Calculus II", credits: 4 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU MATH 261.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 265", sourceName: "Calculus III", sourceCredits: 4, targetCourses: [{ code: "MATH 360", name: "Calculus III", credits: 4 }], status: "transfers", notes: "Satisfies the MATH Restricted Elective requirement at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 266", sourceName: "Linear Algebra", sourceCredits: 3, targetCourses: [{ code: "MATH 325", name: "Linear Algebra", credits: 3 }], status: "transfers", notes: "Satisfies the MATH Restricted Elective requirement at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "MTH 288", sourceName: "Discrete Mathematics", sourceCredits: 3, targetCourses: [{ code: "MATH 280", name: "Discrete Math Computer Science", credits: 3 }], status: "transfers", notes: "Alternate to CSC 208. Transfers to VSU's MATH 280.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 221", sourceName: "Introduction to Problem Solving and Programming", sourceCredits: 3, targetCourses: [{ code: "CSCI 150", name: "Programming I", credits: 3 }], status: "transfers", notes: "Transfers as CSCI 150 only — no lab credit. Complete CSC 222 for full programming sequence credit.", conflictReason: null, alternativePathway: "NOVA students typically follow with CSC 222 to complete the programming sequence with lab credit.", lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 222", sourceName: "Object Oriented Programming", sourceCredits: 4, targetCourses: [{ code: "CSCI 150", name: "Programming I", credits: 3 }, { code: "CSCI 151", name: "Programming 1 Lab", credits: 1 }, { code: "ENGR 204", name: "Intro to Object Oriented Programming", credits: 4 }], status: "expanded", notes: "Expands into three VSU courses including an engineering credit. One of the strongest equivalencies.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 208", sourceName: "Introduction to Discrete Structures", sourceCredits: 3, targetCourses: [{ code: "CSCI 281", name: "Discrete Structures", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU CSCI 281.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 223", sourceName: "Data Structures and Analysis of Algorithms", sourceCredits: 4, targetCourses: [{ code: "CSCI 250", name: "Programming II", credits: 3 }, { code: "CSCI 251", name: "Programming II Lab", credits: 1 }], status: "expanded", notes: "Expands to lecture and lab at VSU (CSCI 250 + CSCI 251).", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 205", sourceName: "Computer Organization", sourceCredits: 3, targetCourses: [{ code: "CSCI 303", name: "Computer Org & Architecture", credits: 3 }], status: "transfers", notes: "Direct equivalent. Satisfies VSU CSCI 303.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01" },
  { sourceCode: "CSC 215", sourceName: "Computer Systems", sourceCredits: 3, targetCourses: [], status: "no-equivalent", notes: null, conflictReason: "CSC 215 does not appear in the VSU transfer equivalency table.", alternativePathway: "Check with a VSU advisor — may count as a general or restricted elective.", lastUpdated: "2024-08-01" },
  { sourceCode: "HIS Elective", sourceName: "History Elective (HIS 101, 102, 111, 112, 121, or 122)", sourceCredits: 3, targetCourses: [{ code: "HIST (varies)", name: "History (GE Requirement)", credits: 3 }], status: "transfers", notes: "All standard VCCS history courses transfer to VSU as GE History credit.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-history" },
  { sourceCode: "Hum/FA Elective 1", sourceName: "Humanities/Fine Arts Elective (2nd Semester)", sourceCredits: 3, targetCourses: [{ code: "GE Humanities/FA", name: "Humanities or Fine Arts (GE)", credits: 3 }], status: "transfers", notes: "Must be from two of three areas: Fine Arts, Humanities, Literature. All eligible VCCS courses transfer as GE credit at VSU.", conflictReason: null, alternativePathway: "PHI 220 (Ethics) satisfies both the NOVA Humanities requirement and VSU's PHIL 275.", lastUpdated: "2024-08-01", electiveGroupId: "nova-humanities" },
  { sourceCode: "Hum/FA Elective 2", sourceName: "Humanities/Fine Arts Elective (4th Semester)", sourceCredits: 3, targetCourses: [{ code: "GE Humanities/FA", name: "Humanities or Fine Arts (GE)", credits: 3 }], status: "transfers", notes: "Must be from a different area than Hum/FA Elective 1. Transfers as GE credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-humanities" },
  { sourceCode: "Soc/Beh Elective", sourceName: "Social/Behavioral Sciences Elective (4th Semester)", sourceCredits: 3, targetCourses: [{ code: "GE Social Science", name: "Social/Behavioral Sciences (GE)", credits: 3 }], status: "transfers", notes: "Eligible courses include ECO, GEO, PLS, PSY, SOC. All transfer as GE Social Science credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-social-sciences" },
  { sourceCode: "Science Lab 1", sourceName: "Physical/Life Science w/Lab (3rd Semester)", sourceCredits: 4, targetCourses: [{ code: "BIOL/CHEM/PHYS (varies)", name: "Lab Science (GE)", credits: 4 }], status: "transfers", notes: "Options: BIO 101, CHM 111, PHY 241, GOL 105/106. All transfer as VSU lab science credit.", conflictReason: null, alternativePathway: "PHY 241 (University Physics I) is a strong choice for the VSU CS lab science requirement.", lastUpdated: "2024-08-01", electiveGroupId: "nova-lab-science" },
  { sourceCode: "Science Lab 2", sourceName: "Physical/Life Science w/Lab (4th Semester)", sourceCredits: 4, targetCourses: [{ code: "BIOL/CHEM/PHYS (varies)", name: "Lab Science (GE)", credits: 4 }], status: "transfers", notes: "Should form a sequence with semester 3 science. All transfer as VSU lab science credit.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-lab-science" },
  { sourceCode: "Approved Elective", sourceName: "Approved Elective (4th Semester)", sourceCredits: 3, targetCourses: [{ code: "Elective (varies)", name: "Elective Credit at VSU", credits: 3 }], status: "conditional", notes: "Transfer value at VSU depends on the course chosen.", conflictReason: null, alternativePathway: "CSC 205 (Computer Organization) is the highest-value elective as it directly satisfies a VSU core requirement.", lastUpdated: "2024-08-01", electiveGroupId: "nova-approved-electives" },
  { sourceCode: "PHY 241", sourceName: "University Physics I", sourceCredits: 4, targetCourses: [{ code: "PHYS 112", name: "General Physics I", credits: 4 }], status: "transfers", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-lab-science" },
  { sourceCode: "PHY 242", sourceName: "University Physics II", sourceCredits: 4, targetCourses: [{ code: "PHYS 113", name: "General Physics II", credits: 4 }], status: "transfers", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-lab-science" },
  { sourceCode: "BIO 101", sourceName: "General Biology I", sourceCredits: 4, targetCourses: [{ code: "BIOL 120", name: "Principles of Biology I", credits: 3 }, { code: "BIOL 120L", name: "Principles of Biology I Lab", credits: 1 }], status: "expanded", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-lab-science" },
  { sourceCode: "CHM 111", sourceName: "General Chemistry I", sourceCredits: 4, targetCourses: [{ code: "CHEM 151", name: "General Chemistry I", credits: 3 }, { code: "CHEM 153", name: "General Chemistry I Laboratory", credits: 1 }], status: "expanded", notes: "Satisfies one semester of VSU lab science requirement.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-lab-science" },
  { sourceCode: "EGR 121", sourceName: "Foundations of Engineering", sourceCredits: 2, targetCourses: [{ code: "ENGR 101", name: "Introduction to Engineering I", credits: 2 }], status: "transfers", notes: "Transfers to VSU as Engineering I credit.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-approved-electives" },
  { sourceCode: "EGR 270", sourceName: "Fundamentals of Computer Engineering", sourceCredits: 4, targetCourses: [], status: "conditional", notes: "Transfer equivalency at VSU is not confirmed — verify with a VSU advisor.", conflictReason: null, alternativePathway: "May count as a restricted or unrestricted elective in the VSU CS program.", lastUpdated: "2024-08-01", electiveGroupId: "nova-approved-electives" },
  { sourceCode: "CST 100", sourceName: "Principles of Public Speaking", sourceCredits: 3, targetCourses: [{ code: "SPEE 214", name: "Introduction to Public Speaking", credits: 3 }], status: "transfers", notes: "Transfers as Speech/Communication credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-approved-electives" },
  { sourceCode: "CST 110", sourceName: "Introduction to Human Communication", sourceCredits: 3, targetCourses: [{ code: "SPEE 214", name: "Introduction to Public Speaking", credits: 3 }], status: "transfers", notes: "Transfers as Speech/Communication credit at VSU.", conflictReason: null, alternativePathway: null, lastUpdated: "2024-08-01", electiveGroupId: "nova-approved-electives" },
]

export const transferAgreements: TransferAgreement[] = [
  {
    id: "brightpoint-vsu-cs",
    sourceSchool: "Brightpoint Community College",
    targetSchool: "Virginia State University",
    program: "Computer Science",
    lastUpdated: "2024-08-01",
    status: "current",
    courses: BRIGHTPOINT_VSU_CS_COURSES,
    electiveGroups: BCC_ELECTIVE_GROUPS,
  },
  {
    id: "nova-vsu-cs",
    sourceSchool: "Northern Virginia Community College",
    targetSchool: "Virginia State University",
    program: "Computer Science",
    lastUpdated: "2024-08-01",
    status: "current",
    courses: NOVA_VSU_CS_COURSES,
    electiveGroups: NOVA_ELECTIVE_GROUPS,
  },
]

export const transferAgreementMap: Record<string, TransferAgreement> = Object.fromEntries(
  transferAgreements.map((a) => [a.id, a])
)

export function getTransferMap(agreementId: string): Record<string, CourseMapping> {
  const agreement = transferAgreementMap[agreementId]
  if (!agreement) return {}
  return Object.fromEntries(
    agreement.courses.map((c) => [c.sourceCode.trim().toUpperCase(), c])
  )
}

export function getElectiveGroupMap(agreementId: string): Record<string, ElectiveGroupDef> {
  const agreement = transferAgreementMap[agreementId]
  if (!agreement?.electiveGroups) return {}
  return Object.fromEntries(agreement.electiveGroups.map((g) => [g.id, g]))
}
