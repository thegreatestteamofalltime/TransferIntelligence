import { useState } from "react"
import { ChevronDown, ArrowRight, BookOpen, Calculator, Lightbulb, GraduationCap, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { vsuCSBachelorfull } from "@/data/vsuCSDegree"
import { navigate } from "@/lib/router"
import { cn } from "@/lib/utils"

const { creditSummary, requirements, electiveOptions } = vsuCSBachelorfull

const sections = [
  {
    key: "general-ed",
    label: "General Education",
    shortLabel: "Gen Ed",
    credits: creditSummary.generalEducation,
    icon: BookOpen,
    color: "oklch(0.55 0.15 145)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    description: "English, history, social sciences, and other required general courses",
    note: "These are standard college-wide requirements — many transfer directly from your community college.",
  },
  {
    key: "core",
    label: "Core CS Courses",
    shortLabel: "Core",
    credits: creditSummary.coreRequirements,
    icon: GraduationCap,
    color: "var(--brand)",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    description: "Required computer science courses at VSU",
    note: "These are the heart of the CS degree — taken at VSU after you transfer.",
  },
  {
    key: "math",
    label: "Math & Statistics",
    shortLabel: "Math",
    credits: creditSummary.majorConcentration,
    icon: Calculator,
    color: "oklch(0.55 0.18 250)",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    description: "Calculus, discrete math, and probability/statistics",
    note: "Calculus I & II can often be completed at your community college before transferring.",
  },
  {
    key: "elective",
    label: "Electives",
    shortLabel: "Elective",
    credits: creditSummary.electives,
    icon: Lightbulb,
    color: "oklch(0.55 0.12 320)",
    bgClass: "bg-pink-50",
    textClass: "text-pink-700",
    borderClass: "border-pink-200",
    description: "Choose from approved CSCI/MATH lists and science lab courses",
    note: "You pick these! See the options below to find topics that interest you.",
  },
]

const electiveColorMap: Record<string, { text: string; bg: string; border: string }> = {
  csci: {
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  math: {
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  science: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
}

export function VSUDegreePanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedElective, setExpandedElective] = useState<string | null>(null)

  const coreReqs = requirements.filter((r) => r.category === "core")
  const mathReqs = requirements.filter((r) => r.category === "math")
  const electiveReqs = requirements.filter((r) => r.category === "elective")

  const coursesBySection: Record<string, typeof requirements> = {
    core: coreReqs,
    math: mathReqs,
    elective: electiveReqs,
  }

  return (
    <div className="light px-5 py-5 border-t border-slate-200 bg-slate-50 text-slate-900">

      {/* Plain-language header */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900 mb-1">What you need to graduate</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          This degree takes <strong className="text-slate-900">120 credits</strong> total. Here's exactly what those credits cover — tap any section to see the courses.
        </p>
      </div>

      {/* Credit bar */}
      <div className="mb-5">
        <div className="flex rounded-full overflow-hidden h-3 gap-px">
          {sections.map((s) => (
            <div
              key={s.key}
              className="h-full transition-all"
              style={{
                width: `${(s.credits / 120) * 100}%`,
                backgroundColor: s.color,
              }}
              title={`${s.label}: ${s.credits} credits`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {sections.map((s) => (
            <div key={s.key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-slate-500">{s.shortLabel} <span className="font-semibold text-slate-900">{s.credits}</span></span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-4 bg-slate-200" />

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section) => {
          const isOpen = expandedSection === section.key
          const Icon = section.icon
          const courses = coursesBySection[section.key]
          const isGenEd = section.key === "general-ed"

          return (
            <div
              key={section.key}
              className={cn("rounded-xl border overflow-hidden transition-all", section.borderClass)}
            >
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  section.bgClass,
                  "hover:brightness-95"
                )}
                onClick={() => setExpandedSection(isOpen ? null : section.key)}
                aria-expanded={isOpen}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: section.color }}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-sm font-semibold", section.textClass)}>{section.label}</span>
                    <Badge
                      className="text-xs font-bold px-2 py-0 text-white border-0"
                      style={{ backgroundColor: section.color }}
                    >
                      {section.credits} credits
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{section.description}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                    section.textClass
                  )}
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {isOpen && (
                <div className="bg-white px-4 pt-3 pb-4">
                  {/* Plain-language tip */}
                  <div className="flex gap-2 mb-3 p-2.5 rounded-lg bg-slate-100">
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                    <p className="text-xs text-slate-500 leading-relaxed">{section.note}</p>
                  </div>

                  {isGenEd ? (
                    <div className="space-y-2">
                      {[
                        { label: "English Composition (ENGL 110 & 111)", credits: 6, note: "Freshman writing sequence" },
                        { label: "Technical Communication (ENGL 342 or 310)", credits: 3, note: "Junior-level writing for CS" },
                        { label: "Ethics / Humanities (PHIL 275 or 450)", credits: 3, note: "Choose one philosophy course" },
                        { label: "History", credits: 3, note: "Any approved history course" },
                        { label: "Social Science", credits: 3, note: "Any approved social science course" },
                        { label: "Literature", credits: 3, note: "Any approved literature course" },
                        { label: "Global Studies", credits: 3, note: "Any approved global studies course" },
                        { label: "Health / Wellness", credits: 2, note: "Physical education or wellness course" },
                        { label: "Additional Gen Ed electives", credits: 7, note: "Remaining credits to reach 33 total" },
                      ].map((item) => (
                        <div key={item.label} className={cn("flex items-start gap-3 p-2.5 rounded-lg border", section.borderClass, section.bgClass)}>
                          <span className={cn("text-sm font-bold tabular-nums flex-shrink-0 w-12", section.textClass)}>{item.credits} cr</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 leading-snug">{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : section.key === "elective" ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        {electiveReqs.map((req, i) => (
                          <div key={i} className={cn("flex items-start gap-3 p-2.5 rounded-lg border", section.borderClass, section.bgClass)}>
                            <span className={cn("text-sm font-bold tabular-nums flex-shrink-0 w-12", section.textClass)}>{req.credits} cr</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 leading-snug">{req.name}</p>
                              {req.notes && <p className="text-xs text-slate-500 mt-0.5">{req.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-2">Browse Your Options</p>
                      <div className="space-y-2">
                        {electiveOptions.map((group) => {
                          const colors = electiveColorMap[group.category] ?? electiveColorMap.csci
                          const isEOpen = expandedElective === group.category
                          return (
                            <div key={group.category} className={cn("rounded-lg border overflow-hidden", colors.border)}>
                              <button
                                className={cn("w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors", colors.bg, "hover:brightness-95")}
                                onClick={() => setExpandedElective(isEOpen ? null : group.category)}
                                aria-expanded={isEOpen}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-xs font-semibold", colors.text)}>{group.label}</span>
                                  <span className="text-xs text-slate-500">— {group.courses.length} choices</span>
                                </div>
                                <ChevronDown
                                  className={cn("h-3.5 w-3.5 transition-transform duration-200", colors.text)}
                                  style={{ transform: isEOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                />
                              </button>
                              {isEOpen && (
                                <div className="bg-white px-3 py-3">
                                  {group.note && (
                                    <p className="text-xs text-slate-500 italic mb-2 leading-relaxed">{group.note}</p>
                                  )}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                    {group.courses.map((c) => (
                                      <div key={c.code} className="flex items-center gap-2 py-1">
                                        <span className={cn("text-xs font-mono font-bold flex-shrink-0 w-20", colors.text)}>
                                          {c.code}
                                        </span>
                                        <span className="text-xs text-slate-500 leading-tight">{c.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {courses?.map((course, i) => (
                        <div key={i} className={cn("flex items-start gap-3 p-2.5 rounded-lg border", section.borderClass, section.bgClass)}>
                          <span className={cn("text-sm font-bold tabular-nums flex-shrink-0 w-12", section.textClass)}>{course.credits} cr</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={cn("text-xs font-mono font-bold flex-shrink-0", section.textClass)}>{course.code}</span>
                              <span className="text-sm font-medium text-slate-800 leading-snug">{course.name}</span>
                            </div>
                            {course.notes && (
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{course.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Credit summary table */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Credit Breakdown</p>
        <div className="space-y-2">
          {sections.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-sm text-slate-700 flex-1">{s.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(s.credits / 120) * 100}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums text-slate-900 w-12 text-right">{s.credits} cr</span>
              </div>
            </div>
          ))}
          <Separator className="my-2 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-900 flex-1">Total</span>
            <span className="text-sm font-bold tabular-nums w-12 text-right" style={{ color: "var(--brand)" }}>
              120 cr
            </span>
          </div>
        </div>
      </div>

      {/* Source + CTA */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">Source: {vsuCSBachelorfull.source}</p>
        <Button
          size="sm"
          className="gap-1.5 text-white text-xs"
          style={{ backgroundColor: "var(--brand)" }}
          onClick={() => navigate("/planner")}
        >
          Plan this degree
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
