export interface Advisor {
  id: string
  name: string
  school: string
  program: string
  title: string
  email: string
  specialties: string[]
  availability: string
  gender?: "male" | "female"
}

export const advisors: Advisor[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    school: "Virginia State University",
    program: "Computer Science",
    title: "Transfer Advisor",
    email: "s.mitchell@vsu.edu",
    specialties: ["CS Transfer", "Articulation Agreements", "STEM Pathways"],
    availability: "Mon–Fri, 9am–5pm",
    gender: "female",
  },
  {
    id: "4",
    name: "James Rivera",
    school: "Brightpoint Community College",
    program: "Computer Science",
    title: "Transfer Pathway Counselor",
    email: "j.rivera@brightpoint.edu",
    specialties: ["CS Transfer", "Transfer Planning", "First-Generation Students"],
    availability: "Mon–Fri, 9am–3pm",
    gender: "male",
  },
  {
    id: "5",
    name: "Priya Sharma",
    school: "Northern Virginia Community College",
    program: "Computer Science",
    title: "Transfer Advisor",
    email: "p.sharma@nvcc.edu",
    specialties: ["CS Transfer", "STEM Pathways", "Articulation Agreements"],
    availability: "Mon, Wed, Fri, 9am–5pm",
    gender: "female",
  },
]

export const advisorsBySchool: Record<string, Advisor[]> = advisors.reduce<Record<string, Advisor[]>>(
  (acc, a) => {
    if (!acc[a.school]) acc[a.school] = []
    acc[a.school].push(a)
    return acc
  },
  {}
)
