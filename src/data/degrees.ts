export interface DegreeRequirement {
  code: string
  name: string
  credits: number
  category: "core" | "general-ed" | "elective" | "math" | "science"
  year?: "freshman" | "sophomore" | "junior" | "senior"
  notes?: string
  isOption?: boolean
}

export interface DegreePlan {
  id: string
  school: string
  abbreviation: string
  degree: string
  program: string
  totalCredits: number
  requirements: DegreeRequirement[]
  source: string
}

export const novaCSAssociate: DegreePlan = {
  id: "nova-cs-as",
  school: "Northern Virginia Community College",
  abbreviation: "NOVA",
  degree: "Associate of Science (A.S.)",
  program: "Computer Science",
  totalCredits: 60,
  source: "NOVA Academic Catalog — Computer Science, A.S. (Transfer Degree)",
  requirements: [
    { code: "CSC 221", name: "Introduction to Problem Solving and Programming", credits: 3, category: "core", year: "freshman", notes: "Required CSC course" },
    { code: "CSC 222", name: "Object Oriented Programming", credits: 4, category: "core", year: "freshman", notes: "Required CSC course" },
    { code: "CSC 223", name: "Data Structures and Analysis of Algorithms", credits: 4, category: "core", year: "sophomore", notes: "Required CSC course" },
    { code: "CSC 205", name: "Computer Organization", credits: 3, category: "core", year: "sophomore", notes: "Choose one: CSC 205, CSC 215, or MTH 265 (Calculus III)", isOption: true },
    { code: "CSC 208", name: "Introduction to Discrete Structures", credits: 3, category: "math", year: "sophomore", notes: "Choose one: CSC 208 or MTH 288 (Discrete Mathematics)", isOption: true },
    { code: "MTH 167", name: "PreCalculus with Trigonometry", credits: 5, category: "math", year: "freshman", notes: "Option 1 only — skip if placed out of precalculus" },
    { code: "MTH 263", name: "Calculus I", credits: 4, category: "math", year: "freshman", notes: "Required" },
    { code: "MTH 264", name: "Calculus II", credits: 4, category: "math", year: "sophomore", notes: "Required — MTH 245 Statistics I may substitute if required by transfer institution" },
    { code: "ENG 111", name: "College Composition I", credits: 3, category: "general-ed", year: "freshman", notes: "Required" },
    { code: "ENG 112", name: "College Composition II", credits: 3, category: "general-ed", year: "freshman", notes: "Required" },
    { code: "SDV 100/101", name: "College Success Skills or Orientation", credits: 1, category: "general-ed", year: "freshman", notes: "Choose one: SDV 100 or SDV 101" },
    { code: "Science w/Lab 1", name: "Physical/Life Science w/Lab (Course 1)", credits: 4, category: "science", year: "sophomore", notes: "8 credits required — choose 2 from: BIO 101/102, CHM 111/112, PHY 241/242, GOL 105/106" },
    { code: "Science w/Lab 2", name: "Physical/Life Science w/Lab (Course 2)", credits: 4, category: "science", year: "sophomore", notes: "8 credits required — choose 2 from: BIO 101/102, CHM 111/112, PHY 241/242, GOL 105/106" },
    { code: "Hum/FA Elective 1", name: "Humanities/Fine Arts Elective (Area 1)", credits: 3, category: "general-ed", year: "freshman", notes: "6–8 credits required from two different areas: Fine Arts, Humanities, or Literature" },
    { code: "Hum/FA Elective 2", name: "Humanities/Fine Arts Elective (Area 2)", credits: 3, category: "general-ed", year: "sophomore", notes: "Must be from a different area than Area 1" },
    { code: "HIS Elective", name: "History Elective", credits: 3, category: "general-ed", year: "freshman", notes: "3 credits required — choose from HIS 101/102/111/112/121/122/203/231/254" },
    { code: "Soc/Beh Elective", name: "Social/Behavioral Sciences Elective", credits: 3, category: "general-ed", year: "sophomore", notes: "3 credits required — ADJ 100, ECO, GEO, PLS, PSY, or SOC courses" },
    { code: "Approved Elective", name: "Approved Elective", credits: 3, category: "elective", year: "sophomore", notes: "3–4 credits (Option 1) or replace MTH 167 for Option 2 — PHY 201, CSC 195/205/215/295, EGR 121/122/270, CST 100/110, MTH 265/266/283, or science courses" },
  ],
}

export const brightpointCSAssociate: DegreePlan = {
  id: "brightpoint-cs-as",
  school: "Brightpoint Community College",
  abbreviation: "BCC",
  degree: "Associate of Science (A.S.)",
  program: "Computer Science",
  totalCredits: 60,
  source: "Brightpoint Community College — Computer Science, A.S. (Transfer Degree)",
  requirements: [
    { code: "CSC 221", name: "Introduction to Problem Solving and Programming", credits: 3, category: "core", year: "freshman", notes: "Major requirement" },
    { code: "CSC 222", name: "Object-Oriented Programming", credits: 4, category: "core", year: "freshman", notes: "Major requirement" },
    { code: "CSC 205", name: "Computer Organization", credits: 3, category: "core", year: "sophomore", notes: "Major requirement" },
    { code: "CSC 223", name: "Data Structures and Analysis of Algorithms", credits: 4, category: "core", year: "sophomore", notes: "Major requirement" },
    { code: "CSC 208", name: "Introduction to Discrete Structures", credits: 3, category: "core", year: "sophomore", notes: "Major requirement" },
    { code: "SDV 100", name: "College Success Skills", credits: 1, category: "general-ed", year: "freshman", notes: "Student Development" },
    { code: "ENG 111", name: "College Composition I", credits: 3, category: "general-ed", year: "freshman" },
    { code: "ENG 112", name: "College Composition II", credits: 3, category: "general-ed", year: "freshman" },
    { code: "MTH 263", name: "Calculus I", credits: 4, category: "math", year: "freshman" },
    { code: "MTH 264", name: "Calculus II", credits: 4, category: "math", year: "freshman" },
    { code: "Lab Science", name: "Lab Science Sequence (choose 2 in a sequence)", credits: 8, category: "science", year: "sophomore", notes: "BIO 101 & BIO 102, CHM 111 & CHM 112, PHY 201 & PHY 202, or PHY 241 & PHY 242" },
    { code: "HIS Elective", name: "History (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "HIS 101/102/111/112/121/122" },
    { code: "Hum Elective", name: "Humanities (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "PHI 100/111/220, REL 100/230" },
    { code: "Soc/Beh Elective", name: "Social/Behavioral Sciences (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "ECO 150/201/202, GEO 210/220, PLS 135/140/241, PSY 200, SOC 200/211/268" },
    { code: "Arts/Lit Elective", name: "Arts/Literature (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "ART 101/102, CST 130/151, MUS 121/226, ENG 225/245/246/255/258/275" },
    { code: "Approved Electives", name: "Approved Electives (choose 2–3, minimum 8 credits)", credits: 8, category: "elective", year: "sophomore", notes: "CSC 195, EGR 121/122/270, ITE 152, MTH 161/162/245/265/266, PHY 241/242, CHM 111/112, CST 100/110" },
  ],
}

import { vsuCSBachelorfull } from "./vsuCSDegree"

export { vsuCSBachelorfull as vsuCSBachelor } from "./vsuCSDegree"

export const degreePlans: DegreePlan[] = [novaCSAssociate, brightpointCSAssociate, vsuCSBachelorfull]

export const degreePlanMap: Record<string, DegreePlan> = Object.fromEntries(
  degreePlans.map((d) => [d.id, d])
)
