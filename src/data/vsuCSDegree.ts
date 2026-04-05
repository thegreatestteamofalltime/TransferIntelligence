import { type DegreePlan } from "./degrees"

export const vsuCSBachelorfull: DegreePlan & {
  creditSummary: {
    generalEducation: number
    coreRequirements: number
    majorConcentration: number
    electives: number
    total: number
  }
  electiveOptions: {
    category: string
    label: string
    note?: string
    courses: { code: string; name: string; credits: number }[]
  }[]
} = {
  id: "vsu-cs-bs",
  school: "Virginia State University",
  abbreviation: "VSU",
  degree: "Bachelor of Science (B.S.)",
  program: "Computer Science",
  totalCredits: 120,
  source: "VSU Undergraduate Catalog — Computer Science, B.S.",

  requirements: [
    // Core Requirements — 54 credits
    { code: "CSCI 101", name: "Intro to Computer Science Profession", credits: 2, category: "core" },
    { code: "CSCI 150", name: "Programming I", credits: 3, category: "core" },
    { code: "CSCI 151", name: "Programming I Lab", credits: 1, category: "core" },
    { code: "CSCI 250", name: "Programming II", credits: 3, category: "core" },
    { code: "CSCI 251", name: "Programming II Lab", credits: 1, category: "core" },
    { code: "CSCI 281", name: "Discrete Structures", credits: 3, category: "core" },
    { code: "CSCI 287", name: "Data Structures", credits: 3, category: "core" },
    { code: "CSCI 296", name: "Web Programming", credits: 3, category: "core" },
    { code: "CSCI 303", name: "Computer Org & Architecture", credits: 3, category: "core" },
    { code: "CSCI 356", name: "Database Systems", credits: 3, category: "core" },
    { code: "CSCI 358", name: "Introduction to Information Assurance", credits: 3, category: "core" },
    { code: "CSCI 392", name: "Algorithms & Advanced Data Structures", credits: 3, category: "core" },
    { code: "CSCI 400", name: "Computer Science Seminar", credits: 2, category: "core" },
    { code: "CSCI 445", name: "Computer Communication Networks", credits: 3, category: "core" },
    { code: "CSCI 471", name: "Parallel & Distributed Programming", credits: 3, category: "core" },
    { code: "CSCI 485", name: "Programming Languages", credits: 3, category: "core" },
    { code: "CSCI 487", name: "Software Design and Development", credits: 3, category: "core" },
    { code: "CSCI 489", name: "Operating Systems", credits: 3, category: "core" },
    { code: "CSCI 493", name: "Senior Project I", credits: 3, category: "core" },
    { code: "CSCI 494", name: "Senior Project II", credits: 3, category: "core" },

    // Major/Concentration Requirements — 14 credits
    { code: "MATH 260", name: "Calculus I", credits: 4, category: "math" },
    { code: "MATH 261", name: "Calculus II", credits: 4, category: "math" },
    { code: "MATH 280", name: "Discrete Math Computer Science", credits: 3, category: "math" },
    { code: "STAT 340", name: "Probability & Statistics for Computer Scientists", credits: 3, category: "math" },

    // Restricted Electives — 13 credits (CSCI/MATH/Science options)
    { code: "CSCI Elective 1", name: "CSCI Restricted Elective", credits: 3, category: "elective", notes: "Select from approved CSCI elective list" },
    { code: "CSCI Elective 2", name: "CSCI Restricted Elective", credits: 3, category: "elective", notes: "Select from approved CSCI elective list" },
    { code: "CSCI Elective 3", name: "CSCI or MATH Restricted Elective", credits: 3, category: "elective", notes: "Select from approved CSCI or MATH elective list" },
    { code: "MATH Elective", name: "MATH Restricted Elective", credits: 3, category: "elective", notes: "Select from approved MATH elective list" },
    { code: "Lab Science", name: "BIOL/CHEM/PHYS Laboratory Science", credits: 1, category: "elective", notes: "Must be intended for science/engineering majors — advisor approval required. Up to 8 credits total across science selections." },

    // Unrestricted Electives — 6 credits
    { code: "Unrestricted Elec 1", name: "Unrestricted Elective", credits: 3, category: "elective" },
    { code: "Unrestricted Elec 2", name: "Unrestricted Elective", credits: 3, category: "elective" },
  ],

  creditSummary: {
    generalEducation: 33,
    coreRequirements: 54,
    majorConcentration: 14,
    electives: 19,
    total: 120,
  },

  electiveOptions: [
    {
      category: "csci",
      label: "CSCI Elective Options",
      courses: [
        { code: "CSCI 312", name: "Introduction to Robotics", credits: 3 },
        { code: "CSCI 361", name: "Embedded Systems: Design/Application", credits: 3 },
        { code: "CSCI 389", name: "Human-Computer Interaction", credits: 3 },
        { code: "CSCI 396", name: "Advanced Web Programming", credits: 3 },
        { code: "CSCI 298", name: "Internship Computer Science I", credits: 3 },
        { code: "CSCI 398", name: "Internship Computer Science II", credits: 3 },
        { code: "CSCI 402", name: "Introduction to Artificial Intelligence", credits: 3 },
        { code: "CSCI 450", name: "Computer Forensics", credits: 3 },
        { code: "CSCI 451", name: "Computer Security", credits: 3 },
        { code: "CSCI 452", name: "Introduction to Cryptography", credits: 3 },
        { code: "CSCI 453", name: "Digital Image Processing", credits: 3 },
        { code: "CSCI 456", name: "Advanced Database Applications", credits: 3 },
        { code: "CSCI 457", name: "Introduction to Data Mining", credits: 3 },
        { code: "CSCI 460", name: "Computability & Formal Language Theory", credits: 3 },
        { code: "CSCI 462", name: "Compiler Construction", credits: 3 },
        { code: "CSCI 480", name: "Computer Graphics", credits: 3 },
        { code: "CSCI 482", name: "Matrix Computations", credits: 3 },
        { code: "CSCI 488", name: "Advanced Systems Architecture", credits: 3 },
        { code: "CSCI 492", name: "Algorithms and Complexity", credits: 3 },
        { code: "CSCI 495", name: "Topics in Computer Science", credits: 3 },
        { code: "CSCI 496", name: "Web Design & Cyber Security", credits: 3 },
      ],
    },
    {
      category: "math",
      label: "MATH Elective Options",
      courses: [
        { code: "MATH 292", name: "Number Theory", credits: 3 },
        { code: "MATH 317", name: "Stochastic Processes", credits: 3 },
        { code: "MATH 321", name: "Combinatorics", credits: 3 },
        { code: "MATH 325", name: "Linear Algebra", credits: 3 },
        { code: "MATH 335", name: "Mathematical Modeling", credits: 3 },
        { code: "MATH 340", name: "Geometry", credits: 3 },
        { code: "MATH 348", name: "Game Theory", credits: 3 },
        { code: "MATH 350", name: "Differential Equations", credits: 3 },
        { code: "MATH 352", name: "Mathematical Biology", credits: 3 },
        { code: "MATH 360", name: "Calculus III", credits: 3 },
        { code: "MATH 392", name: "Linear Programming", credits: 3 },
        { code: "MATH 415", name: "Matrix Theory", credits: 3 },
        { code: "MATH 417", name: "Numerical Linear Algebra", credits: 3 },
        { code: "MATH 425", name: "Abstract Algebra I", credits: 3 },
        { code: "MATH 452", name: "Numerical Analysis", credits: 3 },
        { code: "MATH 473", name: "Wavelets", credits: 3 },
        { code: "MATH 490", name: "Graph Theory", credits: 3 },
        { code: "STAT 380", name: "Probability & Statistics II", credits: 3 },
      ],
    },
    {
      category: "science",
      label: "BIOL/CHEM/PHYS Laboratory Course Options",
      note: "Courses must be intended for science and engineering majors. Get approval from your academic advisor.",
      courses: [
        { code: "PHYS 105", name: "Introduction to Physics I", credits: 4 },
        { code: "PHYS 106", name: "Introduction to Physics II", credits: 4 },
        { code: "PHYS 112", name: "General Physics I", credits: 4 },
        { code: "PHYS 113", name: "General Physics II", credits: 4 },
        { code: "CHEM 151", name: "General Chemistry I", credits: 3 },
        { code: "CHEM 153", name: "General Chemistry I Lab", credits: 1 },
        { code: "CHEM 152", name: "General Chemistry II", credits: 3 },
        { code: "CHEM 154", name: "General Chemistry II Lab", credits: 1 },
        { code: "BIOL 120", name: "Principles of Biology I", credits: 4 },
        { code: "BIOL 121", name: "Principles of Biology II", credits: 4 },
      ],
    },
  ],
}

export const vsuCSSummary = {
  generalEducation: 33,
  coreRequirements: 54,
  majorConcentration: 14,
  electives: 19,
  totalCreditHours: 120,
}
