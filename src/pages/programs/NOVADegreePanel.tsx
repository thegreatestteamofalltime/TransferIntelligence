import { useState } from "react"
import { ChevronDown, ArrowRight, BookOpen, Calculator, FlaskConical, GraduationCap, Lightbulb, Info, TriangleAlert, Circle as HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { novaCSAssociate } from "@/data/degrees"
import { navigate } from "@/lib/router"
import { cn } from "@/lib/utils"

type PlacementOption = "none" | "option1" | "option2"

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
    note: "These four courses form the required CS sequence at NOVA and transfer directly toward your bachelor's degree.",
  },
  math: {
    label: "Math Requirements",
    shortLabel: "Math",
    icon: Calculator,
    color: "oklch(0.55 0.18 250)",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    description: "Calculus, discrete math, and optional precalculus",
    note: "MTH 167 (PreCalculus) is only required for Option 1. If you place into Calculus, you follow Option 2 and use those 5 credits for electives instead.",
  },
  science: {
    label: "Physical/Life Sciences",
    shortLabel: "Science",
    icon: FlaskConical,
    color: "oklch(0.50 0.18 60)",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
    description: "8 credits — two lab science courses",
    note: "You must complete two lab science courses totaling 8 credits. Choose any two from BIO, CHM, PHY, or GOL — sequential pairs strongly recommended.",
  },
  "general-ed": {
    label: "General Education",
    shortLabel: "Gen Ed",
    icon: BookOpen,
    color: "oklch(0.55 0.15 145)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    description: "English, history, humanities, social sciences",
    note: "Standard college-wide requirements. Humanities/Fine Arts courses must come from two different areas (Fine Arts, Humanities, or Literature).",
  },
  elective: {
    label: "Approved Electives",
    shortLabel: "Electives",
    icon: Lightbulb,
    color: "oklch(0.55 0.12 320)",
    bgClass: "bg-pink-50",
    textClass: "text-pink-700",
    borderClass: "border-pink-200",
    description: "3–4 credits (Option 1) or 6–8 credits (Option 2)",
    note: "Option 1 students get 3–4 elective credits. Option 2 students place out of MTH 167 and replace those 5 credits with additional electives from the approved list.",
  },
}

const scienceOptions = [
  { code: "BIO 101", name: "General Biology I", credits: 4 },
  { code: "BIO 102", name: "General Biology II", credits: 4 },
  { code: "CHM 111", name: "General Chemistry I", credits: 4 },
  { code: "CHM 112", name: "General Chemistry II", credits: 4 },
  { code: "PHY 241", name: "University Physics I", credits: 4 },
  { code: "PHY 242", name: "University Physics II", credits: 4 },
  { code: "GOL 105", name: "Physical Geology", credits: 4 },
  { code: "GOL 106", name: "Historical Geology", credits: 4 },
]

const genEdSubSections = [
  {
    key: "eng",
    label: "English Composition",
    creditsRequired: 6,
    courses: [
      { code: "ENG 111", name: "College Composition I", credits: 3 },
      { code: "ENG 112", name: "College Composition II", credits: 3 },
    ],
  },
  {
    key: "sdv",
    label: "Student Development",
    creditsRequired: 1,
    note: "Choose one.",
    courses: [
      { code: "SDV 100", name: "College Success Skills", credits: 1 },
      { code: "SDV 101", name: "New Student Orientation", credits: 1 },
    ],
  },
  {
    key: "his",
    label: "History",
    creditsRequired: 3,
    note: "Choose one.",
    courses: [
      { code: "HIS 101", name: "Western Civilizations Pre-1600 CE", credits: 3 },
      { code: "HIS 102", name: "Western Civilizations Post-1600 CE", credits: 3 },
      { code: "HIS 111", name: "World Civilizations Pre-1500 CE", credits: 3 },
      { code: "HIS 112", name: "World Civilizations Post-1500 CE", credits: 3 },
      { code: "HIS 121", name: "United States History to 1877", credits: 3 },
      { code: "HIS 122", name: "United States History Since 1865", credits: 3 },
      { code: "HIS 203", name: "History of African Civilizations", credits: 3 },
      { code: "HIS 231", name: "Introduction to Latin American History", credits: 3 },
      { code: "HIS 254", name: "History of Modern East Asian Civilizations", credits: 3 },
    ],
  },
  {
    key: "hum-fa",
    label: "Humanities / Fine Arts",
    creditsRequired: "6–8",
    note: "6–8 credits required from two different areas (Fine Arts, Humanities, or Literature).",
    subGroups: [
      {
        label: "Fine Arts",
        courses: [
          { code: "ART 100", name: "Art Appreciation", credits: 3 },
          { code: "ART 101", name: "History of Art: Prehistoric to Gothic", credits: 3 },
          { code: "ART 102", name: "History of Art: Renaissance to Modern", credits: 3 },
          { code: "ART 150", name: "History of Film & Animation", credits: 3 },
          { code: "ART 215", name: "History of Modern Art", credits: 3 },
          { code: "ART 250", name: "History of Design", credits: 3 },
          { code: "CST 130", name: "Introduction to the Theatre", credits: 3 },
          { code: "CST 141", name: "Theatre Appreciation I", credits: 3 },
          { code: "CST 151", name: "Film Appreciation I", credits: 3 },
          { code: "MUS 121", name: "Music in Society", credits: 3 },
          { code: "MUS 221", name: "History of Western Music pre-1750", credits: 3 },
          { code: "MUS 222", name: "History of Western Music 1750 to Present", credits: 3 },
          { code: "MUS 225", name: "The History of Jazz", credits: 3 },
          { code: "PHT 110", name: "History of Photography", credits: 3 },
        ],
      },
      {
        label: "Humanities",
        courses: [
          { code: "ARC 200", name: "History of Architecture", credits: 4 },
          { code: "ASL 201", name: "Intermediate American Sign Language I", credits: 3 },
          { code: "ASL 202", name: "Intermediate American Sign Language II", credits: 3 },
          { code: "HUM 201", name: "Early Humanities", credits: 3 },
          { code: "HUM 202", name: "Modern Humanities", credits: 3 },
          { code: "HUM 210", name: "Introduction to Women and Gender Studies", credits: 3 },
          { code: "HUM 220", name: "Introduction to African American Studies", credits: 3 },
          { code: "HUM 259", name: "The Greek and Roman Tradition", credits: 3 },
          { code: "PHI 100", name: "Introduction to Philosophy", credits: 3 },
          { code: "PHI 111", name: "Logic", credits: 3 },
          { code: "PHI 220", name: "Ethics and Society", credits: 3 },
          { code: "PHI 227", name: "Biomedical Ethics", credits: 3 },
          { code: "REL 100", name: "Introduction to the Study of Religion", credits: 3 },
          { code: "REL 230", name: "Religions of the World", credits: 3 },
          { code: "REL 233", name: "Introduction to Islam", credits: 3 },
          { code: "REL 237", name: "Religions of the East", credits: 3 },
          { code: "REL 238", name: "Religions of the West", credits: 3 },
          { code: "ARA 201", name: "Intermediate Arabic I", credits: 4 },
          { code: "ARA 202", name: "Intermediate Arabic II", credits: 4 },
          { code: "CHI 201", name: "Intermediate Chinese I", credits: 4 },
          { code: "CHI 202", name: "Intermediate Chinese II", credits: 4 },
          { code: "FRE 201", name: "Intermediate French I", credits: 3 },
          { code: "FRE 202", name: "Intermediate French II", credits: 3 },
          { code: "GER 201", name: "Intermediate German I", credits: 3 },
          { code: "GER 202", name: "Intermediate German II", credits: 3 },
          { code: "JPN 201", name: "Intermediate Japanese I", credits: 4 },
          { code: "JPN 202", name: "Intermediate Japanese II", credits: 4 },
          { code: "LAT 201", name: "Intermediate Latin I", credits: 3 },
          { code: "LAT 202", name: "Intermediate Latin II", credits: 3 },
          { code: "RUS 201", name: "Intermediate Russian I", credits: 4 },
          { code: "RUS 202", name: "Intermediate Russian II", credits: 4 },
          { code: "SPA 201", name: "Intermediate Spanish I", credits: 3 },
          { code: "SPA 202", name: "Intermediate Spanish II", credits: 3 },
        ],
      },
      {
        label: "Literature",
        courses: [
          { code: "ENG 225", name: "Reading Literature: Culture and Ideas", credits: 3 },
          { code: "ENG 230", name: "Mystery in Literature & Film", credits: 3 },
          { code: "ENG 236", name: "Introduction to the Short Story", credits: 3 },
          { code: "ENG 237", name: "Introduction to Poetry", credits: 3 },
          { code: "ENG 245", name: "British Literature", credits: 3 },
          { code: "ENG 246", name: "American Literature", credits: 3 },
          { code: "ENG 250", name: "Children's Literature", credits: 3 },
          { code: "ENG 255", name: "World Literature", credits: 3 },
          { code: "ENG 256", name: "Literature of Science Fiction", credits: 3 },
          { code: "ENG 257", name: "Mythological Literature", credits: 3 },
          { code: "ENG 258", name: "African American Literature", credits: 3 },
          { code: "ENG 271", name: "The Works of Shakespeare I", credits: 3 },
          { code: "ENG 275", name: "Women in Literature", credits: 3 },
          { code: "ENG 279", name: "Film and Literature", credits: 3 },
        ],
      },
    ],
  },
  {
    key: "soc",
    label: "Social / Behavioral Sciences",
    creditsRequired: 3,
    note: "Choose one.",
    courses: [
      { code: "ADJ 100", name: "Survey of Criminal Justice", credits: 3 },
      { code: "ECO 150", name: "Economic Essentials: Theory and Application", credits: 3 },
      { code: "ECO 201", name: "Principles of Macroeconomics", credits: 3 },
      { code: "ECO 202", name: "Principles of Microeconomics", credits: 3 },
      { code: "GEO 200", name: "Introduction to Physical Geography", credits: 3 },
      { code: "GEO 210", name: "People & the Land: Intro. to Cultural Geography", credits: 3 },
      { code: "GEO 220", name: "World Regional Geography", credits: 3 },
      { code: "PLS 135", name: "U.S. Government and Politics", credits: 3 },
      { code: "PLS 140", name: "Introduction to Comparative Politics", credits: 3 },
      { code: "PLS 200", name: "Introduction to Political and Democratic Theory", credits: 3 },
      { code: "PLS 241", name: "Introduction to International Relations", credits: 3 },
      { code: "PSY 200", name: "Principles of Psychology", credits: 3 },
      { code: "PSY 216", name: "Social Psychology", credits: 3 },
      { code: "PSY 219", name: "Cross-Cultural Psychology", credits: 3 },
      { code: "PSY 230", name: "Developmental Psychology", credits: 3 },
      { code: "SOC 200", name: "Introduction to Sociology", credits: 3 },
      { code: "SOC 211", name: "Cultural Anthropology", credits: 3 },
      { code: "SOC 268", name: "Social Problems", credits: 3 },
    ],
  },
]

const approvedElectives = [
  { code: "PHY 201", name: "General College Physics I", credits: 4 },
  { code: "CSC 195", name: "Topics In: (variable)", credits: 3 },
  { code: "CSC 215", name: "Computer Systems", credits: 3 },
  { code: "CSC 295", name: "Topics In: (variable)", credits: 3 },
  { code: "EGR 121", name: "Foundations of Engineering", credits: 2 },
  { code: "EGR 122", name: "Engineering Design", credits: 3 },
  { code: "EGR 270", name: "Fundamentals of Computer Engineering", credits: 4 },
  { code: "CST 100", name: "Principles of Public Speaking", credits: 3 },
  { code: "CST 110", name: "Introduction to Human Communication", credits: 3 },
  { code: "MTH 265", name: "Calculus III", credits: 4 },
  { code: "MTH 266", name: "Linear Algebra", credits: 3 },
  { code: "MTH 283", name: "Probability and Statistics", credits: 3 },
  { code: "BIO 101", name: "General Biology I", credits: 4 },
  { code: "BIO 102", name: "General Biology II", credits: 4 },
  { code: "CHM 111", name: "General Chemistry I", credits: 4 },
  { code: "CHM 112", name: "General Chemistry II", credits: 4 },
  { code: "PHY 241", name: "University Physics I", credits: 4 },
  { code: "PHY 242", name: "University Physics II", credits: 4 },
  { code: "GOL 105", name: "Physical Geology", credits: 4 },
  { code: "GOL 106", name: "Historical Geology", credits: 4 },
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
      <abbr title="credits" className={cn("text-xs font-bold tabular-nums flex-shrink-0 ml-1 no-underline", textClass)}>{credits}</abbr>
    </div>
  )
}

interface ChooseOneDropdownProps {
  label: string
  courses: { code: string; name: string; credits: number }[]
  textClass: string
  bgClass: string
  borderClass: string
  isOpen: boolean
  onToggle: () => void
  creditNote?: string
}

function ChooseOneDropdown({ label, courses, textClass, bgClass, borderClass, isOpen, onToggle, creditNote }: ChooseOneDropdownProps) {
  return (
    <div className={cn("rounded-lg border overflow-hidden", borderClass)}>
      <button
        className={cn("w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors", bgClass, "hover:brightness-95")}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-semibold", textClass)}>Choose one</span>
          <span className="text-xs text-slate-500">— {label}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {creditNote && <abbr title="credits" className={cn("text-xs font-bold tabular-nums no-underline", textClass)}>{creditNote}</abbr>}
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-200", textClass)}
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>
      {isOpen && (
        <div className="bg-white px-3 py-2 space-y-1">
          {courses.map((c) => (
            <CourseChip key={c.code} {...c} textClass={textClass} bgClass={bgClass} borderClass={borderClass} />
          ))}
        </div>
      )}
    </div>
  )
}

export function NOVADegreePanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedGenEdSub, setExpandedGenEdSub] = useState<string | null>(null)
  const [expandedHumSub, setExpandedHumSub] = useState<string | null>(null)
  const [expandedChooseOne, setExpandedChooseOne] = useState<string | null>(null)
  const [placement, setPlacement] = useState<PlacementOption>("none")

  const totalCredits = placement === "option1" ? 60 : 58

  const sectionCredits: Record<string, string | number> = {
    core: 14,
    math: placement === "option1" ? "16" : placement === "option2" ? "11" : "11–16",
    science: 8,
    "general-ed": 20,
    elective: placement === "option2" ? "6–8" : "3–8",
  }

  const barSegments = [
    { key: "core", credits: 14, color: sectionMeta.core.color },
    { key: "math", credits: placement === "option1" ? 16 : 11, color: sectionMeta.math.color },
    { key: "science", credits: 8, color: sectionMeta.science.color },
    { key: "general-ed", credits: 20, color: sectionMeta["general-ed"].color },
    { key: "elective", credits: placement === "option2" ? 6 : 3, color: sectionMeta.elective.color },
  ]
  const barTotal = barSegments.reduce((s, seg) => s + seg.credits, 0)

  const placementOptions: { value: PlacementOption; label: string; sublabel: string }[] = [
    { value: "option1", label: "Need PreCalc", sublabel: "MTH 167 required" },
    { value: "none", label: "Not sure yet", sublabel: "Show both options" },
    { value: "option2", label: "Placed out", sublabel: "Skip MTH 167" },
  ]

  return (
    <div className="light px-5 py-5 border-t border-slate-200 bg-slate-50 text-slate-900">

      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-900 mb-1">What you need to graduate</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          This degree requires a minimum of <strong className="text-slate-900">{totalCredits} credits</strong> depending on your math placement. Tap any section or bar segment to see the courses.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <p className="text-xs font-semibold text-slate-600">Where do you place in math?</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {placementOptions.map((opt) => {
            const isSelected = placement === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setPlacement(isSelected ? "none" : opt.value)}
                className={cn(
                  "flex flex-col items-center text-center px-2 py-2.5 rounded-lg border transition-all",
                  isSelected
                    ? "border-sky-400 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                )}
              >
                <span className={cn("text-xs font-semibold leading-snug", isSelected ? "text-sky-700" : "text-slate-700")}>
                  {opt.label}
                </span>
                <span className={cn("text-[10px] leading-snug mt-0.5", isSelected ? "text-sky-500" : "text-slate-400")}>
                  {opt.sublabel}
                </span>
              </button>
            )
          })}
        </div>
        {placement === "none" && (
          <p className="text-[10px] text-slate-400 mt-2 text-center">Select an option to see your personalized plan</p>
        )}
        {placement === "option1" && (
          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2">
            <TriangleAlert className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-relaxed">MTH 167 (5 cr) is required before Calculus. Your total is <strong>60–63 credits</strong>.</p>
          </div>
        )}
        {placement === "option2" && (
          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-2">
            <Info className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-emerald-700 leading-relaxed">MTH 167 is skipped. Those credits become additional electives, keeping your total at <strong>58–62 credits</strong>.</p>
          </div>
        )}
      </div>

      <div className="mb-5">
        <div className="flex rounded-full overflow-hidden h-3 gap-px">
          {barSegments.map((seg) => (
            <button
              key={seg.key}
              className="h-full transition-all duration-300 cursor-pointer hover:brightness-110 focus:outline-none focus-visible:brightness-110"
              style={{ width: `${(seg.credits / barTotal) * 100}%`, backgroundColor: seg.color }}
              title={`${sectionMeta[seg.key as keyof typeof sectionMeta].label}: ${seg.credits} credits — click to view`}
              onClick={() => setExpandedSection(expandedSection === seg.key ? null : seg.key)}
              aria-label={`View ${sectionMeta[seg.key as keyof typeof sectionMeta].label}`}
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
                      title="credits"
                    >
                      {credits}
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
                      {/* Fixed required courses */}
                      {[
                        { code: "CSC 221", name: "Introduction to Problem Solving and Programming", credits: 3 },
                        { code: "CSC 222", name: "Object Oriented Programming", credits: 4 },
                        { code: "CSC 223", name: "Data Structures and Analysis of Algorithms", credits: 4 },
                      ].map((r) => (
                        <CourseChip key={r.code} {...r} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
                      ))}
                      {/* CSC 205 / CSC 215 / MTH 265 choice */}
                      <ChooseOneDropdown
                        label="Computer Organization / Systems / Calculus III"
                        courses={[
                          { code: "CSC 205", name: "Computer Organization", credits: 3 },
                          { code: "CSC 215", name: "Computer Systems", credits: 3 },
                          { code: "MTH 265", name: "Calculus III", credits: 4 },
                        ]}
                        textClass={section.textClass}
                        bgClass={section.bgClass}
                        borderClass={section.borderClass}
                        isOpen={expandedChooseOne === "core-org"}
                        onToggle={() => setExpandedChooseOne(expandedChooseOne === "core-org" ? null : "core-org")}
                        creditNote="3–4"
                      />
                    </div>
                  )}

                  {key === "math" && (
                    <div className="space-y-1.5">
                      {/* MTH 167 — placement-aware */}
                      {(() => {
                        const isSkipped = placement === "option2"
                        const isHighlighted = placement === "option1"
                        return (
                          <div
                            className={cn(
                              "flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-all",
                              isSkipped
                                ? "border-slate-200 bg-slate-50 opacity-50"
                                : isHighlighted
                                ? "border-amber-300 bg-amber-50"
                                : cn(section.borderClass, section.bgClass)
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className={cn("text-xs font-mono font-bold flex-shrink-0", isSkipped ? "text-slate-400" : isHighlighted ? "text-amber-700" : section.textClass)}>MTH 167</span>
                                <span className={cn("text-sm font-medium leading-snug", isSkipped ? "text-slate-400 line-through" : "text-slate-800")}>PreCalculus with Trigonometry</span>
                                {isSkipped && <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">not needed</span>}
                                {!isSkipped && placement === "none" && <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Option 1 only</span>}
                              </div>
                              {!isSkipped && (
                                <p className={cn("text-xs mt-0.5 leading-snug", isHighlighted ? "text-amber-600 font-medium" : "text-slate-500")}>
                                  Required if you need PreCalculus before Calculus I
                                </p>
                              )}
                            </div>
                            <abbr title="credits" className={cn("text-sm font-bold tabular-nums flex-shrink-0 ml-2 no-underline", isSkipped ? "text-slate-400" : isHighlighted ? "text-amber-700" : section.textClass)}>5</abbr>
                          </div>
                        )
                      })()}
                      {/* Fixed math courses */}
                      {[
                        { code: "MTH 263", name: "Calculus I", credits: 4, note: "Required" },
                      ].map((r) => (
                        <div key={r.code} className={cn("flex items-start gap-3 px-3 py-2.5 rounded-lg border", section.borderClass, section.bgClass)}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={cn("text-xs font-mono font-bold flex-shrink-0", section.textClass)}>{r.code}</span>
                              <span className="text-sm font-medium text-slate-800 leading-snug">{r.name}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{r.note}</p>
                          </div>
                          <abbr title="credits" className={cn("text-sm font-bold tabular-nums flex-shrink-0 ml-2 no-underline", section.textClass)}>{r.credits}</abbr>
                        </div>
                      ))}
                      {/* MTH 264 / MTH 245 choice */}
                      <ChooseOneDropdown
                        label="Calculus II or Statistics I"
                        courses={[
                          { code: "MTH 264", name: "Calculus II", credits: 4 },
                          { code: "MTH 245", name: "Statistics I", credits: 3 },
                        ]}
                        textClass={section.textClass}
                        bgClass={section.bgClass}
                        borderClass={section.borderClass}
                        isOpen={expandedChooseOne === "math-calc2"}
                        onToggle={() => setExpandedChooseOne(expandedChooseOne === "math-calc2" ? null : "math-calc2")}
                        creditNote="3–4"
                      />
                      {/* CSC 208 / MTH 288 choice */}
                      <ChooseOneDropdown
                        label="Discrete Structures or Discrete Mathematics"
                        courses={[
                          { code: "CSC 208", name: "Introduction to Discrete Structures", credits: 3 },
                          { code: "MTH 288", name: "Discrete Mathematics", credits: 3 },
                        ]}
                        textClass={section.textClass}
                        bgClass={section.bgClass}
                        borderClass={section.borderClass}
                        isOpen={expandedChooseOne === "math-discrete"}
                        onToggle={() => setExpandedChooseOne(expandedChooseOne === "math-discrete" ? null : "math-discrete")}
                        creditNote="3"
                      />
                    </div>
                  )}

                  {key === "science" && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Choose any 2 courses (8 credits total):</p>
                      {scienceOptions.map((c) => (
                        <CourseChip key={c.code} {...c} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
                      ))}
                    </div>
                  )}

                  {key === "general-ed" && (
                    <div className="space-y-2">
                      {genEdSubSections.map((sub) => {
                        const isSubOpen = expandedGenEdSub === sub.key
                        const isHumFA = sub.key === "hum-fa"

                        return (
                          <div key={sub.key} className={cn("rounded-lg border overflow-hidden", section.borderClass)}>
                            <button
                              className={cn("w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors", section.bgClass, "hover:brightness-95")}
                              onClick={() => setExpandedGenEdSub(isSubOpen ? null : sub.key)}
                              aria-expanded={isSubOpen}
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-semibold", section.textClass)}>{sub.label}</span>
                                {!isHumFA && (
                                  <span className="text-xs text-slate-500">— {(sub as { courses?: unknown[] }).courses?.length ?? 0} options</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <abbr title="credits" className={cn("text-xs font-bold tabular-nums no-underline", section.textClass)}>
                                  {sub.creditsRequired}
                                </abbr>
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
                                {isHumFA ? (
                                  <div className="space-y-2">
                                    {(sub as typeof genEdSubSections[3]).subGroups?.map((group) => {
                                      const isGroupOpen = expandedHumSub === group.label
                                      return (
                                        <div key={group.label} className={cn("rounded-lg border overflow-hidden", section.borderClass)}>
                                          <button
                                            className={cn("w-full flex items-center justify-between px-3 py-2 text-left transition-colors", section.bgClass, "hover:brightness-95")}
                                            onClick={() => setExpandedHumSub(isGroupOpen ? null : group.label)}
                                          >
                                            <span className={cn("text-xs font-semibold", section.textClass)}>{group.label}</span>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs text-slate-500">{group.courses.length} options</span>
                                              <ChevronDown
                                                className={cn("h-3 w-3 transition-transform duration-200", section.textClass)}
                                                style={{ transform: isGroupOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                              />
                                            </div>
                                          </button>
                                          {isGroupOpen && (
                                            <div className="bg-white px-3 py-2 space-y-1">
                                              {group.courses.map((c) => (
                                                <CourseChip key={c.code} {...c} textClass={section.textClass} bgClass={section.bgClass} borderClass={section.borderClass} />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    {(sub as { courses?: { code: string; name: string; credits: number }[] }).courses?.map((c) => (
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
                  )}

                  {key === "elective" && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Approved elective options:</p>
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
            const barWidth = typeof credits === "number" ? (credits / barTotal) * 100 : 15
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-sm text-slate-700 flex-1">{s.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: s.color }} />
                  </div>
                  <abbr title="credits" className="text-sm font-bold tabular-nums text-slate-900 w-16 text-right no-underline">{credits}</abbr>
                </div>
              </div>
            )
          })}
          <Separator className="my-2 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-900 flex-1">
              Total Minimum Credits
            </span>
            <abbr title="credits" className="text-sm font-bold tabular-nums w-16 text-right no-underline" style={{ color: "var(--brand)" }}>
              {placement === "option1" ? "60" : "58"}
            </abbr>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">Source: {novaCSAssociate.source}</p>
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
