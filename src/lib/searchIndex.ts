import type { Route } from "@/lib/router"
import { colleges } from "@/data/colleges"
import { advisors } from "@/data/advisors"
import { terms } from "@/data/terminology"
import { faqs } from "@/data/faq"
import { novaCSAssociate, brightpointCSAssociate } from "@/data/degrees"
import { vsuCSBachelorfull } from "@/data/vsuCSDegree"

export interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: string
  route: Route
  detail?: string
}

const staticPages: SearchResult[] = [
  { id: "home", title: "Home", subtitle: "Landing page", category: "Page", route: "/" },
  { id: "get-started", title: "Get Started", subtitle: "Step-by-step guide to using TransferIntelligence", category: "Page", route: "/get-started" },
  { id: "planner", title: "Transfer Planner", subtitle: "Plan your course transfers interactively", category: "Page", route: "/planner" },
  { id: "colleges", title: "Colleges", subtitle: "Browse colleges in the TransInt network", category: "Page", route: "/colleges" },
  { id: "programs", title: "Programs", subtitle: "Explore degree programs and requirements", category: "Page", route: "/programs" },
  { id: "advisors", title: "Advisors", subtitle: "Find academic transfer advisors", category: "Page", route: "/advisors" },
  { id: "agreements", title: "Articulation Agreements", subtitle: "View transfer agreements between schools", category: "Page", route: "/agreements" },
  { id: "terminology", title: "Terminology", subtitle: "Transfer terms and definitions glossary", category: "Page", route: "/terminology" },
  { id: "faq", title: "FAQ", subtitle: "Frequently asked questions about transferring", category: "Page", route: "/faq" },
  { id: "contact", title: "Contact", subtitle: "Get in touch with advisors and support", category: "Page", route: "/contact" },
  { id: "about", title: "About", subtitle: "Learn about TransferIntelligence", category: "Page", route: "/about" },
]

const collegeResults: SearchResult[] = colleges.map((c) => ({
  id: `college-${c.id}`,
  title: c.name,
  subtitle: `${c.type} · ${c.location}`,
  category: "College",
  route: "/colleges",
  detail: c.description,
}))

const advisorResults: SearchResult[] = advisors.map((a) => ({
  id: `advisor-${a.id}`,
  title: a.name,
  subtitle: `${a.title} · ${a.school}`,
  category: "Advisor",
  route: "/advisors",
  detail: a.specialties.join(", "),
}))

const termResults: SearchResult[] = terms.map((t) => ({
  id: `term-${t.id}`,
  title: t.term,
  subtitle: t.shortDefinition,
  category: "Term",
  route: "/terminology",
  detail: t.definition,
}))

const faqResults: SearchResult[] = faqs.map((f) => ({
  id: `faq-${f.id}`,
  title: f.question,
  subtitle: `FAQ · ${f.category}`,
  category: "FAQ",
  route: "/faq",
  detail: f.answer,
}))

const degreePlans = [novaCSAssociate, brightpointCSAssociate, vsuCSBachelorfull]
const courseResults: SearchResult[] = degreePlans.flatMap((plan) =>
  plan.requirements.map((req) => ({
    id: `course-${plan.abbreviation}-${req.code}`,
    title: `${req.code} — ${req.name}`,
    subtitle: `${plan.abbreviation} · ${plan.degree}`,
    category: "Course",
    route: "/programs" as Route,
    detail: req.notes,
  }))
)

const programResults: SearchResult[] = degreePlans.map((plan) => ({
  id: `program-${plan.id}`,
  title: `${plan.program} — ${plan.degree}`,
  subtitle: plan.school,
  category: "Program",
  route: "/programs",
}))

const ALL_RESULTS: SearchResult[] = [
  ...staticPages,
  ...collegeResults,
  ...advisorResults,
  ...termResults,
  ...faqResults,
  ...courseResults,
  ...programResults,
]

function score(result: SearchResult, query: string): number {
  const q = query.toLowerCase()
  const title = result.title.toLowerCase()
  const subtitle = (result.subtitle ?? "").toLowerCase()
  const detail = (result.detail ?? "").toLowerCase()
  const category = result.category.toLowerCase()

  if (title === q) return 100
  if (title.startsWith(q)) return 80
  if (title.includes(q)) return 60
  if (subtitle.includes(q)) return 40
  if (category.includes(q)) return 30
  if (detail.includes(q)) return 20
  return 0
}

export function search(query: string, limit = 8): SearchResult[] {
  const q = query.trim()
  if (q.length < 2) return []
  return ALL_RESULTS
    .map((r) => ({ result: r, score: score(r, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.result)
}
