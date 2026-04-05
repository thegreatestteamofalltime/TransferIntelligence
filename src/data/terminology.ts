export interface Term {
  id: string
  term: string
  definition: string
  shortDefinition: string
  example?: string
  relatedTerms?: string[]
}

export const terms: Term[] = [
  {
    id: "articulation-agreement",
    term: "Articulation Agreement",
    shortDefinition: "A formal agreement between two colleges recognizing transferred courses.",
    definition:
      "A formal, written agreement between two educational institutions that outlines how credits earned at one school will be accepted at another. Articulation agreements specify which courses transfer, what they transfer as, and how they count toward a degree at the receiving school.",
    example:
      "Brightpoint's articulation agreement with VSU guarantees that ENG 111 transfers and counts toward VSU's writing requirement.",
    relatedTerms: ["Transfer Credit", "Equivalent Course"],
  },
  {
    id: "transfer-credit",
    term: "Transfer Credit",
    shortDefinition: "Academic credit earned at one school and accepted by another.",
    definition:
      "Credit for coursework completed at a previous institution that is accepted and applied toward a degree at a new school. Transfer credits may count toward general education requirements, major requirements, or free electives, depending on course equivalency evaluations.",
    example:
      "If you took MTH 263 at NOVA, VSU may award transfer credit that satisfies your Calculus I requirement.",
    relatedTerms: ["Articulation Agreement", "Equivalent Course", "Prerequisite"],
  },
  {
    id: "prerequisite",
    term: "Prerequisite",
    shortDefinition: "A required course that must be completed before taking another.",
    definition:
      "A course or requirement that must be successfully completed before a student is eligible to enroll in a more advanced course. Prerequisites ensure students have the foundational knowledge needed to succeed in higher-level coursework.",
    example:
      "MTH 167 (Precalculus) is a prerequisite for MTH 263 (Calculus I) at NOVA. You must pass MTH 167 before registering for MTH 263.",
    relatedTerms: ["Transfer Credit", "Co-Requisite"],
  },
  {
    id: "equivalent-course",
    term: "Equivalent Course",
    shortDefinition: "A course at one school considered equal in content to a course at another.",
    definition:
      "A course offered at one institution that has been formally reviewed and deemed to have equivalent learning outcomes, content, and credit hours to a course at another institution. Equivalent courses transfer directly and may satisfy specific degree requirements.",
    example: "ENG 111 at Brightpoint is equivalent to ENGL 110 at VSU — both are introductory composition courses.",
    relatedTerms: ["Articulation Agreement", "Transfer Credit"],
  },
  {
    id: "general-education",
    term: "General Education Requirements",
    shortDefinition: "Core courses all students must take regardless of their major.",
    definition:
      "A set of courses in various subject areas (writing, math, sciences, humanities, social sciences) required of all students at a college or university, regardless of their major. These courses ensure a well-rounded education and often transfer easily between schools.",
    example:
      "VSU requires all students to complete general education courses in addition to their major requirements.",
    relatedTerms: ["Transfer Credit", "Articulation Agreement"],
  },
  {
    id: "credit-hours",
    term: "Credit Hours",
    shortDefinition: "Units measuring the weight of a course toward degree completion.",
    definition:
      "A unit of measurement representing the number of weekly contact hours in a course, typically over a 15–16 week semester. Most courses are 3 credit hours. Credit hours determine how quickly a student progresses toward degree completion and how courses contribute to GPA.",
    example: "A 3-credit course meets for about 3 hours per week. A full-time student typically takes 12–18 credit hours per semester.",
    relatedTerms: ["Transfer Credit", "GPA"],
  },
  {
    id: "gpa",
    term: "GPA (Grade Point Average)",
    shortDefinition: "A numerical measure of your academic performance.",
    definition:
      "A calculated average representing a student's overall academic performance, typically on a 4.0 scale. Transfer GPA requirements vary by institution and program. Some schools calculate a cumulative transfer GPA and some recalculate it at the receiving school.",
    example:
      "Many Virginia universities require a minimum 2.0 GPA for general transfer admission, while competitive programs like Nursing or Engineering may require a 3.0 or higher.",
    relatedTerms: ["Transfer Credit"],
  },
  {
    id: "degree-audit",
    term: "Degree Audit",
    shortDefinition: "A report showing which degree requirements you've completed.",
    definition:
      "An official review of a student's academic record that shows which degree requirements have been met and which remain outstanding. Students should request a degree audit at both their current and target school to plan their transfer pathway effectively.",
    example: "Running a degree audit at VSU after transfer can show which of your community college credits count toward your Computer Science degree.",
    relatedTerms: ["Transfer Credit", "General Education Requirements"],
  },
]
