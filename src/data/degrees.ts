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
  totalCredits: 61,
  source: "NOVA Academic Catalog — CIP Code 11.0701, NOVA Code 2460",
  requirements: [
    { code: "CSC 221", name: "Introduction to Problem Solving and Programming", credits: 3, category: "core", year: "freshman", notes: "1st Semester" },
    { code: "ENG 111", name: "College Composition I", credits: 3, category: "general-ed", year: "freshman", notes: "1st Semester" },
    { code: "HIS Elective", name: "History Elective", credits: 3, category: "general-ed", year: "freshman", notes: "1st Semester" },
    { code: "MTH 167", name: "PreCalculus with Trigonometry", credits: 5, category: "math", year: "freshman", notes: "1st Semester — only required if not placed out of precalculus" },
    { code: "SDV 100/101", name: "College Success Skills / Orientation", credits: 1, category: "general-ed", year: "freshman", notes: "1st Semester" },
    { code: "CSC 222", name: "Object Oriented Programming", credits: 4, category: "core", year: "freshman", notes: "2nd Semester" },
    { code: "ENG 112", name: "College Composition II", credits: 3, category: "general-ed", year: "freshman", notes: "2nd Semester" },
    { code: "MTH 263", name: "Calculus I", credits: 4, category: "math", year: "freshman", notes: "2nd Semester" },
    { code: "Hum/FA Elective", name: "Humanities/Fine Arts Elective", credits: 3, category: "general-ed", year: "freshman", notes: "2nd Semester" },
    { code: "CSC 208", name: "Introduction to Discrete Structures", credits: 3, category: "core", year: "sophomore", notes: "3rd Semester (or MTH 288 Discrete Mathematics)" },
    { code: "CSC 223", name: "Data Structures and Analysis of Algorithms", credits: 4, category: "core", year: "sophomore", notes: "3rd Semester" },
    { code: "MTH 264", name: "Calculus II", credits: 4, category: "math", year: "sophomore", notes: "3rd Semester" },
    { code: "Science w/Lab", name: "Physical and Life Science Elective w/Lab", credits: 4, category: "science", year: "sophomore", notes: "3rd Semester — BIO 101, CHM 111, PHY 241, or GOL 105/106" },
    { code: "CSC 205", name: "Computer Organization", credits: 3, category: "core", year: "sophomore", notes: "4th Semester — or CSC 215 or MTH 265" },
    { code: "Approved Elective", name: "Approved Elective", credits: 3, category: "elective", year: "sophomore", notes: "4th Semester — see approved elective list" },
    { code: "Hum/FA Elective", name: "Humanities/Fine Arts Elective", credits: 3, category: "general-ed", year: "sophomore", notes: "4th Semester" },
    { code: "Soc/Beh Elective", name: "Social/Behavioral Sciences Elective", credits: 3, category: "general-ed", year: "sophomore", notes: "4th Semester (not a History course)" },
    { code: "Science w/Lab", name: "Physical and Life Science Elective w/Lab", credits: 4, category: "science", year: "sophomore", notes: "4th Semester — BIO 102, CHM 112, PHY 242, or GOL 105/106" },
    { code: "MTH 265", name: "Calculus III", credits: 4, category: "math", year: "sophomore", notes: "Approved elective option" },
    { code: "MTH 266", name: "Linear Algebra", credits: 3, category: "math", year: "sophomore", notes: "Approved elective option" },
  ],
}

export const brightpointCSAssociate: DegreePlan = {
  id: "brightpoint-cs-as",
  school: "Brightpoint Community College",
  abbreviation: "BCC",
  degree: "Associate of Science (A.S.)",
  program: "Computer Science",
  totalCredits: 60,
  source: "Brightpoint Community College 2026-2027 Catalog",
  requirements: [
    { code: "SDV 100", name: "College Success Skills", credits: 1, category: "general-ed", year: "freshman", notes: "Student Development" },
    { code: "ENG 111", name: "College Composition I", credits: 3, category: "general-ed", year: "freshman" },
    { code: "ENG 112", name: "College Composition II", credits: 3, category: "general-ed", year: "freshman" },
    { code: "MTH 263", name: "Calculus I", credits: 4, category: "math", year: "freshman" },
    { code: "MTH 264", name: "Calculus II", credits: 4, category: "math", year: "freshman" },
    { code: "CSC 221", name: "Introduction to Problem Solving and Programming", credits: 3, category: "core", year: "freshman", notes: "Major requirement" },
    { code: "CSC 222", name: "Object-Oriented Programming", credits: 4, category: "core", year: "freshman", notes: "Major requirement" },
    { code: "CSC 205", name: "Computer Organization", credits: 3, category: "core", year: "sophomore", notes: "Major requirement" },
    { code: "CSC 223", name: "Data Structures and Analysis of Algorithms", credits: 4, category: "core", year: "sophomore", notes: "Major requirement" },
    { code: "CSC 208", name: "Introduction to Discrete Structures", credits: 3, category: "core", year: "sophomore", notes: "Major requirement" },
    { code: "Lab Science", name: "Lab Science Sequence (choose 2)", credits: 8, category: "science", year: "sophomore", notes: "BIO 101 & BIO 102, CHM 111 & CHM 112, or PHY 241 & PHY 242" },
    { code: "HIS Elective", name: "History (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "HIS 101/102/111/112/121/122" },
    { code: "Hum Elective", name: "Humanities (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "PHI 100/111/220, REL 100/230" },
    { code: "Soc/Beh Elective", name: "Social/Behavioral Sciences (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "ECO, GEO, PLS, PSY, SOC courses" },
    { code: "Arts/Lit Elective", name: "Arts/Literature (choose 1)", credits: 3, category: "general-ed", year: "sophomore", notes: "ART, CST, MUS, ENG literature courses" },
    { code: "Approved Electives", name: "Approved Electives (choose 2-3, min 8 credits)", credits: 8, category: "elective", year: "sophomore", notes: "CSC 195, EGR 121/122/270, MTH 265/266, PHY 241/242, CHM 111/112, etc." },
  ],
}

export { vsuCSBachelorfull as vsuCSBachelor } from "./vsuCSDegree"

import { vsuCSBachelorfull } from "./vsuCSDegree"

export const degreePlans: DegreePlan[] = [novaCSAssociate, brightpointCSAssociate, vsuCSBachelorfull]
