export type CollegeType = "Community College" | "University"

export interface College {
  id: string
  name: string
  abbreviation: string
  type: CollegeType
  location: string
  website: string
  description: string
}

export const colleges: College[] = [
  {
    id: "brightpoint",
    name: "Brightpoint Community College",
    abbreviation: "BCC",
    type: "Community College",
    location: "Chester & Midlothian, VA",
    website: "https://www.brightpoint.edu",
    description: "Serving the greater Richmond area with transfer-focused programs and dual enrollment opportunities.",
  },
  {
    id: "nvcc",
    name: "Northern Virginia Community College",
    abbreviation: "NOVA",
    type: "Community College",
    location: "Annandale, VA",
    website: "https://www.nvcc.edu",
    description: "The largest community college in Virginia with strong articulation agreements with 4-year institutions.",
  },
  {
    id: "vsu",
    name: "Virginia State University",
    abbreviation: "VSU",
    type: "University",
    location: "Petersburg, VA",
    website: "https://www.vsu.edu",
    description: "A historically Black university with strong CS and engineering transfer programs and VCCS articulation agreements.",
  },
]
