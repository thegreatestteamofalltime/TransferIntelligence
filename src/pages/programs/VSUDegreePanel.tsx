import { useState } from "react"
import { ChevronDown, ArrowRight, BookOpen, Calculator, Lightbulb, GraduationCap, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { vsuCSBachelorfull, vsuCSGenEd } from "@/data/vsuCSDegree"
import { navigate } from "@/lib/router"
import { cn } from "@/lib/utils"

const { creditSummary, requirements, electiveOptions } = vsuCSBachelorfull

const sections = [
  {
    key: "core",
    label: "Core CS Courses",
    shortLabel: "Core CS",
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
    key: "elective",
    label: "Electives",
    shortLabel: "Electives",
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
  csci: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  math: { text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  science: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
}

interface CourseRowProps {
  code: string
  name: string
  credits: number
  note?: string
  textClass: string
  bgClass: string
  borderClass: string
}

function CourseRow({ code, name, credits, note, textClass, bgClass, borderClass }: CourseRowProps) {
  return (
    <div className={cn("flex items-start gap-3 px-3 py-2.5 rounded-lg border", borderClass, bgClass)}>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={cn("text-xs font-mono font-bold flex-shrink-0", textClass)}>{code}</span>
          <span className="text-sm font-medium text-slate-800 leading-snug">{name}</span>
        </div>
        {note && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{note}</p>}
      </div>
      <span className={cn("text-sm font-bold tabular-nums flex-shrink-0 ml-2", textClass)}>{credits} credits</span>
    </div>
  )
}

export function VSUDegreePanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedElective, setExpandedElective] = useState<string | null>(null)
  const [expandedGenEd, setExpandedGenEd] = useState<string | null>(null)

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

      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900 mb-1">What you need to graduate</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          This degree takes <strong className="text-slate-900">120 credits</strong> total. Here's exactly what those credits cover — tap any section to see the courses.
        </p>
      </div>

      <div className="mb-5">
        <div className="flex rounded-full overflow-hidden h-3 gap-px">
          {sections.map((s) => (
            <div
              key={s.key}
              className="h-full transition-all"
              style={{ width: `${(s.credits / 120) * 100}%`, backgroundColor: s.color }}
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

      <div className="space-y-2">
        {sections.map((section) => {
          const isOpen = expandedSection === section.key
          const Icon = section.icon
          const courses = coursesBySection[section.key]
          const isGenEd = section.key === "general-ed"
          const isElective = section.key === "elective"

          return (
            <div key={section.key} className={cn("rounded-xl border overflow-hidden transition-all", section.borderClass)}>
              <button
                className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors", section.bgClass, "hover:brightness-95")}
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
                  className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", section.textClass)}
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {isOpen && (
                <div className="bg-white px-4 pt-3 pb-4">
                  <div className="flex gap-2 mb-3 p-2.5 rounded-lg bg-slate-100">
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                    <p className="text-xs text-slate-500 leading-relaxed">{section.note}</p>
                  </div>

                  {isGenEd ? (
                    <div className="space-y-2">
                      {vsuCSGenEd.map((item, idx) => {
                        const isGEOpen = expandedGenEd === item.label
                        return (
                          <div key={idx} className={cn("rounded-lg border overflow-hidden", section.borderClass)}>
                            <button
                              className={cn("w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors", section.bgClass, "hover:brightness-95")}
                              onClick={() => setExpandedGenEd(isGEOpen ? null : item.label)}
                              aria-expanded={isGEOpen}
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-semibold", section.textClass)}>{item.label}</span>
                                <span className="text-xs text-slate-500">— {item.courses.length} options</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={cn("text-xs font-bold tabular-nums", section.textClass)}>{item.creditsRequired} cr required</span>
                                <ChevronDown
                                  className={cn("h-3.5 w-3.5 transition-transform duration-200", section.textClass)}
                                  style={{ transform: isGEOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                />
                              </div>
                            </button>
                            {isGEOpen && (
                              <div className="bg-white px-3 py-3">
                                {item.note && (
                                  <p className="text-xs text-slate-500 italic mb-2 leading-relaxed">{item.note}</p>
                                )}
                                <div className="space-y-1">
                                  {item.courses.map((c) => (
                                    <div key={c.code} className={cn("flex items-center gap-2 px-2 py-1.5 rounded border", section.borderClass, section.bgClass)}>
                                      <span className={cn("text-xs font-mono font-bold flex-shrink-0 w-20", section.textClass)}>{c.code}</span>
                                      <span className="text-xs text-slate-600 leading-tight flex-1">{c.name}</span>
                                      <abbr title="credits" className={cn("text-xs font-bold tabular-nums flex-shrink-0 no-underline", section.textClass)}>{c.credits}</abbr>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : isElective ? (
                    <div className="space-y-4">
                      <div className={cn("rounded-lg border overflow-hidden", section.borderClass)}>
                        <div className={cn("flex items-center justify-between px-3 py-2.5", section.bgClass)}>
                          <span className={cn("text-xs font-bold", section.textClass)}>Restricted Electives</span>
                          <span className={cn("text-xs font-bold tabular-nums", section.textClass)}>13 credits</span>
                        </div>
                        <div className="bg-white px-3 py-3 space-y-2">
                          {electiveOptions.filter((g) => g.category !== "unrestricted").map((group) => {
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
                                    <span className="text-xs text-slate-500">— {group.courses.length} options</span>
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
                                    <div className="space-y-1">
                                      {group.courses.map((c) => (
                                        <div key={c.code} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", colors.border, colors.bg)}>
                                          <span className={cn("text-xs font-mono font-bold flex-shrink-0 w-20", colors.text)}>{c.code}</span>
                                          <span className="text-xs text-slate-600 leading-tight flex-1">{c.name}</span>
                                          <span className={cn("text-xs font-bold tabular-nums flex-shrink-0", colors.text)}>{c.credits} credits</span>
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

                      <div className={cn("rounded-lg border overflow-hidden", section.borderClass)}>
                        <div className={cn("flex items-center justify-between px-3 py-2.5", section.bgClass)}>
                          <span className={cn("text-xs font-bold", section.textClass)}>Unrestricted Electives</span>
                          <span className={cn("text-xs font-bold tabular-nums", section.textClass)}>6 credits</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {courses?.map((course, i) => (
                        <CourseRow
                          key={i}
                          code={course.code}
                          name={course.name}
                          credits={course.credits}
                          note={course.notes}
                          textClass={section.textClass}
                          bgClass={section.bgClass}
                          borderClass={section.borderClass}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

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
                    style={{ width: `${(s.credits / 120) * 100}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums text-slate-900 w-16 text-right">{s.credits} credits</span>
              </div>
            </div>
          ))}
          <Separator className="my-2 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-900 flex-1">Total</span>
            <span className="text-sm font-bold tabular-nums w-16 text-right" style={{ color: "var(--brand)" }}>
              120 credits
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">Source: {vsuCSBachelorfull.source}</p>
        <Button
          size="sm"
          className="gap-1.5 text-white text-xs"
          style={{ background: "var(--brand-gradient)" }}
          onClick={() => navigate("/planner")}
        >
          Plan this degree
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
