import { useState } from "react"
import { ChevronDown, ArrowRight, BookOpen, Calculator, FlaskConical, GraduationCap, Lightbulb, Info, Palette, Users, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { brightpointCSAssociate } from "@/data/degrees"
import { navigate } from "@/lib/router"
import { cn } from "@/lib/utils"

const SECTION_ORDER = ["core", "math", "science", "general-ed", "elective"] as const

const sectionMeta = {
  core: {
    label: "Core CS Courses",
    shortLabel: "Core CS",
    icon: GraduationCap,
    color: "var(--brand)",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    description: "Required computer science courses",
    note: "These five courses form the required CS core at Brightpoint and transfer directly toward your bachelor's degree.",
  },
  math: {
    label: "Math Requirements",
    shortLabel: "Math",
    icon: Calculator,
    color: "oklch(0.55 0.18 250)",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    description: "Calculus I and Calculus II — 8 credits required",
    note: "Both Calculus I and Calculus II are required for this degree. No PreCalculus placement track — if needed, take MTH 161/162 as elective prerequisites first.",
  },
  science: {
    label: "Lab Science Sequence",
    shortLabel: "Science",
    icon: FlaskConical,
    color: "oklch(0.50 0.18 60)",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
    description: "8 credits — choose two in a sequence",
    note: "Choose two lab science courses that form a sequence: BIO 101 + 102, CHM 111 + 112, PHY 201 + 202, or PHY 241 + 242.",
  },
  "general-ed": {
    label: "General Education",
    shortLabel: "Gen Ed",
    icon: BookOpen,
    color: "oklch(0.55 0.15 145)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    description: "English, history, humanities, social sciences, arts/literature",
    note: "Standard college-wide requirements. Each area has a specific credit requirement and course options to choose from.",
  },
  elective: {
    label: "Approved Electives",
    shortLabel: "Electives",
    icon: Lightbulb,
    color: "oklch(0.55 0.12 320)",
    bgClass: "bg-pink-50",
    textClass: "text-pink-700",
    borderClass: "border-pink-200",
    description: "8 credits minimum — choose 2 or 3 courses",
    note: "Select at least 8 credits from the approved elective list. Options include additional math, engineering, CS, and communication courses.",
  },
}

const coreCSCourses = [
  { code: "CSC 221", name: "Introduction to Problem Solving and Programming", credits: 3 },
  { code: "CSC 222", name: "Object-Oriented Programming", credits: 4 },
  { code: "CSC 205", name: "Computer Organization", credits: 3 },
  { code: "CSC 223", name: "Data Structures and Analysis of Algorithms", credits: 4 },
  { code: "CSC 208", name: "Introduction to Discrete Structures", credits: 3 },
]

const mathCourses = [
  { code: "MTH 263", name: "Calculus I", credits: 4 },
  { code: "MTH 264", name: "Calculus II", credits: 4 },
]

const scienceSequences = [
  { label: "Biology Sequence", courses: [{ code: "BIO 101", name: "General Biology I", credits: 4 }, { code: "BIO 102", name: "General Biology II", credits: 4 }] },
  { label: "Chemistry Sequence", courses: [{ code: "CHM 111", name: "General Chemistry I", credits: 4 }, { code: "CHM 112", name: "General Chemistry II", credits: 4 }] },
  { label: "College Physics Sequence", courses: [{ code: "PHY 201", name: "General College Physics I", credits: 4 }, { code: "PHY 202", name: "General College Physics II", credits: 4 }] },
  { label: "University Physics Sequence", courses: [{ code: "PHY 241", name: "University Physics I", credits: 4 }, { code: "PHY 242", name: "University Physics II", credits: 4 }] },
]

const genEdSubSections = [
  {
    key: "eng",
    label: "English Composition",
    icon: BookOpen,
    creditsRequired: 6,
    courses: [
      { code: "ENG 111", name: "College Composition I", credits: 3 },
      { code: "ENG 112", name: "College Composition II", credits: 3 },
    ],
  },
  {
    key: "sdv",
    label: "Student Development",
    icon: GraduationCap,
    creditsRequired: 1,
    note: "Required.",
    courses: [
      { code: "SDV 100", name: "College Success Skills", credits: 1 },
    ],
  },
  {
    key: "his",
    label: "History",
    icon: History,
    creditsRequired: 3,
    note: "Choose one.",
    courses: [
      { code: "HIS 101", name: "Western Civilizations Pre-1600 CE", credits: 3 },
      { code: "HIS 102", name: "Western Civilizations Post-1600 CE", credits: 3 },
      { code: "HIS 111", name: "World Civilization Pre-1500 CE", credits: 3 },
      { code: "HIS 112", name: "World Civilization Post-1500 CE", credits: 3 },
      { code: "HIS 121", name: "United States History to 1877", credits: 3 },
      { code: "HIS 122", name: "United States History Since 1865", credits: 3 },
    ],
  },
  {
    key: "hum",
    label: "Humanities",
    icon: Lightbulb,
    creditsRequired: 3,
    note: "Choose one.",
    courses: [
      { code: "PHI 100", name: "Introduction to Philosophy", credits: 3 },
      { code: "PHI 111", name: "Logic", credits: 3 },
      { code: "PHI 220", name: "Ethics and Society", credits: 3 },
      { code: "REL 100", name: "Introduction to the Study of Religion", credits: 3 },
      { code: "REL 230", name: "Religions of the World", credits: 3 },
    ],
  },
  {
    key: "soc",
    label: "Social / Behavioral Sciences",
    icon: Users,
    creditsRequired: 3,
    note: "Choose one.",
    courses: [
      { code: "ECO 150", name: "Economic Essentials: Theory and Application", credits: 3 },
      { code: "ECO 201", name: "Principles of Macroeconomics", credits: 3 },
      { code: "ECO 202", name: "Principles of Microeconomics", credits: 3 },
      { code: "GEO 210", name: "People and the Land: Intro to Cultural Geography", credits: 3 },
      { code: "GEO 220", name: "World Regional Geography", credits: 3 },
      { code: "PLS 135", name: "U.S. Government and Politics", credits: 3 },
      { code: "PLS 140", name: "Introduction to Comparative Politics", credits: 3 },
      { code: "PLS 241", name: "Introduction to International Relations", credits: 3 },
      { code: "PSY 200", name: "Principles of Psychology", credits: 3 },
      { code: "SOC 200", name: "Introduction to Sociology", credits: 3 },
      { code: "SOC 211", name: "Cultural Anthropology", credits: 3 },
      { code: "SOC 268", name: "Social Problems", credits: 3 },
    ],
  },
  {
    key: "arts",
    label: "Arts / Literature",
    icon: Palette,
    creditsRequired: 3,
    note: "Choose one.",
    courses: [
      { code: "ART 101", name: "History of Art: Prehistoric to Gothic", credits: 3 },
      { code: "ART 102", name: "History of Art: Renaissance to Modern", credits: 3 },
      { code: "CST 130", name: "Introduction to the Theatre", credits: 3 },
      { code: "CST 151", name: "Film Appreciation I", credits: 3 },
      { code: "MUS 121", name: "Music in Society", credits: 3 },
      { code: "MUS 226", name: "World Music", credits: 3 },
      { code: "ENG 245", name: "British Literature", credits: 3 },
      { code: "ENG 246", name: "American Literature", credits: 3 },
      { code: "ENG 255", name: "World Literature", credits: 3 },
      { code: "ENG 258", name: "African American Literature", credits: 3 },
      { code: "ENG 275", name: "Women in Literature", credits: 3 },
      { code: "ENG 225", name: "Reading Literature: Culture and Ideas", credits: 3 },
    ],
  },
]

const approvedElectives = [
  { code: "CHM 111", name: "General Chemistry I", credits: 4 },
  { code: "CHM 112", name: "General Chemistry II", credits: 4 },
  { code: "CST 100", name: "Principles of Public Speaking", credits: 3 },
  { code: "CST 110", name: "Introduction to Human Communication", credits: 3 },
  { code: "EGR 121", name: "Foundations of Engineering", credits: 2 },
  { code: "EGR 122", name: "Engineering Design", credits: 3 },
  { code: "EGR 270", name: "Fundamentals of Computer Engineering", credits: 4 },
  { code: "ITE 152", name: "Introduction to Digital Literacy and Computer Applications", credits: 3 },
  { code: "MTH 161", name: "Precalculus I", credits: 3 },
  { code: "MTH 162", name: "Precalculus II", credits: 3 },
  { code: "MTH 245", name: "Statistics I", credits: 3 },
  { code: "MTH 265", name: "Calculus III", credits: 4 },
  { code: "MTH 266", name: "Linear Algebra", credits: 3 },
  { code: "PHY 241", name: "University Physics I", credits: 4 },
  { code: "PHY 242", name: "University Physics II", credits: 4 },
  { code: "CSC 195", name: "AI Foundations for Computer Science", credits: 3 },
]

interface CourseChipProps {
  code: string
  name: string
  credits: number
  textClass: string
  bgClass: string
  borderClass: string
}

function CourseChip({ code, name, credits, textClass, bgClass, borderClass }: CourseChipProps) {
  return (
    <div className={cn("flex items-center gap-2 px-2.5 py-2 rounded-lg border", borderClass, bgClass)}>
      <span className={cn("text-xs font-mono font-bold flex-shrink-0 w-16", textClass)}>{code}</span>
      <span className="text-xs text-slate-600 leading-tight flex-1">{name}</span>
      <span className={cn("text-xs font-bold tabular-nums flex-shrink-0 ml-1", textClass)}>{credits}cr</span>
    </div>
  )
}

interface SequenceDropdownProps {
  sequence: { label: string; courses: { code: string; name: string; credits: number }[] }
  textClass: string
  bgClass: string
  borderClass: string
  isOpen: boolean
  onToggle: () => void
}

function SequenceDropdown({ sequence, textClass, bgClass, borderClass, isOpen, onToggle }: SequenceDropdownProps) {
  return (
    <div className={cn("rounded-lg border overflow-hidden", borderClass)}>
      <button
        className={cn("w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors", bgClass, "hover:brightness-95")}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-semibold", textClass)}>{sequence.label}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn("text-xs font-bold tabular-nums", textClass)}>8 cr</span>
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-200", textClass)}
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>
      {isOpen && (
        <div className="bg-white px-3 py-2 space-y-1">
          {sequence.courses.map((c) => (
            <CourseChip key={c.code} {...c} textClass={textClass} bgClass={bgClass} borderClass={borderClass} />
          ))}
        </div>
      )}
    </div>
  )
}

export function BCCDegreePanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedGenEdSub, setExpandedGenEdSub] = useState<string | null>(null)
  const [expandedSequence, setExpandedSequence] = useState<string | null>(null)

  const sectionCredits: Record<string, string | number> = {
    core: 17,
    math: 8,
    science: 8,
    "general-ed": 19,
    elective: "8+",
  }

  const barSegments = [
    { key: "core", credits: 17, color: sectionMeta.core.color },
    { key: "math", credits: 8, color: sectionMeta.math.color },
    { key: "science", credits: 8, color: sectionMeta.science.color },
    { key: "general-ed", credits: 19, color: sectionMeta["general-ed"].color },
    { key: "elective", credits: 8, color: sectionMeta.elective.color },
  ]
  const barTotal = barSegments.reduce((s, seg) => s + seg.credits, 0)

  return (
    <div className="light px-5 py-5 border-t border-slate-200 bg-slate-50 text-slate-900">

      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900 mb-1">What you need to graduate</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          This degree requires <strong className="text-slate-900">60 credits minimum</strong>. Tap any section to see the courses.
        </p>
      </div>

      <div className="mb-5">
        <div className="flex rounded-full overflow-hidden h-3 gap-px">
          {barSegments.map((seg) => (
            <div
              key={seg.key}
              className="h-full transition-all duration-300"
              style={{ width: `${(seg.credits / barTotal) * 100}%`, backgroundColor: seg.color }}
              title={`${sectionMeta[seg.key as keyof typeof sectionMeta].label}: ${seg.credits} credits`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {SECTION_ORDER.map((key) => {
            const s = sectionMeta[key]
            return (
              <div key={key} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-slate-500">{s.shortLabel} <span className="font-semibold text-slate-900">{sectionCredits[key]}</span></span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="mb-4 bg-slate-200" />

      <div className="space-y-2">
        {SECTION_ORDER.map((key) => {
          const section = sectionMeta[key]
          const Icon = section.icon
          const isOpen = expandedSection === key
          const credits = sectionCredits[key]

          return (
            <div key={key} className={cn("rounded-xl border overflow-hidden transition-all", section.borderClass)}>
              <button
                className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors", section.bgClass, "hover:brightness-95")}
                onClick={() => setExpandedSection(isOpen ? null : key)}
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
                      {credits} cr
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

                  {key === "core" && (
                    <div className="space-y-1.5">
                      {coreCSCourses.map((c) => (
                        <CourseChip key={c.code} {...c} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
                      ))}
                    </div>
                  )}

                  {key === "math" && (
                    <div className="space-y-1.5">
                      {mathCourses.map((c) => (
                        <CourseChip key={c.code} {...c} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
                      ))}
                    </div>
                  )}

                  {key === "science" && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Choose one sequence (both courses, 8 credits total):</p>
                      {scienceSequences.map((seq) => (
                        <SequenceDropdown
                          key={seq.label}
                          sequence={seq}
                          textClass={section.textClass}
                          bgClass={section.bgClass}
                          borderClass={section.borderClass}
                          isOpen={expandedSequence === seq.label}
                          onToggle={() => setExpandedSequence(expandedSequence === seq.label ? null : seq.label)}
                        />
                      ))}
                    </div>
                  )}

                  {key === "general-ed" && (
                    <div className="space-y-2">
                      {genEdSubSections.map((sub) => {
                        const isSubOpen = expandedGenEdSub === sub.key
                        const SubIcon = sub.icon
                        return (
                          <div key={sub.key} className={cn("rounded-lg border overflow-hidden", section.borderClass)}>
                            <button
                              className={cn("w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors", section.bgClass, "hover:brightness-95")}
                              onClick={() => setExpandedGenEdSub(isSubOpen ? null : sub.key)}
                              aria-expanded={isSubOpen}
                            >
                              <div className="flex items-center gap-2">
                                <SubIcon className={cn("h-3.5 w-3.5 flex-shrink-0", section.textClass)} />
                                <span className={cn("text-xs font-semibold", section.textClass)}>{sub.label}</span>
                                {sub.courses.length > 2 && (
                                  <span className="text-xs text-slate-500">— {sub.courses.length} options</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={cn("text-xs font-bold tabular-nums", section.textClass)}>
                                  {sub.creditsRequired} cr
                                </span>
                                <ChevronDown
                                  className={cn("h-3.5 w-3.5 transition-transform duration-200", section.textClass)}
                                  style={{ transform: isSubOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                />
                              </div>
                            </button>
                            {isSubOpen && (
                              <div className="bg-white px-3 py-3">
                                {sub.note && (
                                  <p className="text-xs text-slate-500 italic mb-2 leading-relaxed">{sub.note}</p>
                                )}
                                <div className="space-y-1">
                                  {sub.courses.map((c) => (
                                    <CourseChip key={c.code} {...c} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {key === "elective" && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Choose 2–3 courses totaling at least 8 credits:</p>
                      {approvedElectives.map((c) => (
                        <CourseChip key={c.code} {...c} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
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
          {SECTION_ORDER.map((key) => {
            const s = sectionMeta[key]
            const credits = sectionCredits[key]
            const barWidth = typeof credits === "number" ? (credits / barTotal) * 100 : 13
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-sm text-slate-700 flex-1">{s.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="text-sm font-bold tabular-nums text-slate-900 w-16 text-right">{credits} cr</span>
                </div>
              </div>
            )
          })}
          <Separator className="my-2 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-900 flex-1">Total Minimum</span>
            <span className="text-sm font-bold tabular-nums w-16 text-right" style={{ color: "var(--brand)" }}>
              60 cr
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">Source: {brightpointCSAssociate.source}</p>
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
