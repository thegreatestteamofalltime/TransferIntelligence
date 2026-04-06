import { useState } from "react"
import {
  CircleCheck as CheckCircle2,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  CalendarDays,
  FileText,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { VCCS_VSU_GAA } from "@/data/agreements/vccs-vsu-gaa"

function SectionRow({ section }: { section: { id: string; title: string; summary: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full text-left flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-[oklch(0.97_0_0)] transition-colors">
          <span className="text-sm font-semibold text-[oklch(0.145_0_0)]">{section.title}</span>
          <ChevronDown
            className={`h-4 w-4 text-[oklch(0.556_0_0)] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-[oklch(0.45_0_0)] leading-relaxed">{section.summary}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function AgreementsPage() {
  const a = VCCS_VSU_GAA
  const req = a.admissionRequirements

  return (
    <div className="flex flex-col bg-white text-[oklch(0.145_0_0)]">

      <section
        className="relative pt-14 pb-16 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.96 0.025 196) 0%, oklch(1 0 0) 55%, oklch(0.97 0.015 220) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 60%, var(--brand) 0%, transparent 55%), radial-gradient(circle at 85% 20%, oklch(0.6 0.15 210) 0%, transparent 55%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[oklch(0.9_0_0)] rounded-full px-4 py-1.5 text-xs font-semibold text-[oklch(0.45_0_0)] mb-5 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
            Active Agreement
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[oklch(0.145_0_0)] text-balance mb-4">
            Transfer Agreement
          </h1>
          <p className="text-lg text-[oklch(0.45_0_0)] max-w-lg mx-auto leading-relaxed">
            This agreement between{" "}
            <strong className="text-[oklch(0.145_0_0)]">Virginia Community College System (VCCS)</strong> and{" "}
            <strong style={{ color: "var(--brand)" }}>Virginia State University</strong>{" "}
            guarantees you admission if you meet a few straightforward requirements.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto space-y-6">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: req.minimumGPA.toFixed(1), label: "Minimum GPA" },
              { value: `${req.minimumCreditsAtVCCS}+`, label: "Credits at VCCS" },
              { value: req.courseGradeMinimum, label: "Min. course grade" },
              { value: `${req.maximumTransferCredits}`, label: "Max. credits transferred" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-[oklch(0.922_0_0)] bg-[oklch(0.985_0_0)] p-4 text-center"
              >
                <div className="text-3xl font-black text-[oklch(0.145_0_0)]">{value}</div>
                <div className="text-xs text-[oklch(0.556_0_0)] mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[oklch(0.922_0_0)] bg-[oklch(0.985_0_0)] px-4 py-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
            <span className="text-sm font-semibold text-[oklch(0.145_0_0)]">No SAT or ACT required</span>
          </div>

          <Separator className="bg-[oklch(0.922_0_0)]" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-4 w-4" style={{ color: "var(--brand)" }} />
              <h2 className="text-sm font-bold text-[oklch(0.145_0_0)] uppercase tracking-wider">Application deadlines</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {req.applicationDeadlines.map((d) => (
                <div
                  key={d.term}
                  className="flex items-center gap-2 rounded-xl border border-[oklch(0.922_0_0)] bg-[oklch(0.985_0_0)] px-4 py-3"
                >
                  <span className="text-sm font-bold text-[oklch(0.145_0_0)]">{d.term}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[oklch(0.556_0_0)]" />
                  <span className="text-sm text-[oklch(0.45_0_0)]">{d.deadline}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-[oklch(0.922_0_0)]" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4" style={{ color: "var(--brand)" }} />
              <h2 className="text-sm font-bold text-[oklch(0.145_0_0)] uppercase tracking-wider">Eligible degree types</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {req.applicableDegrees.map((deg) => (
                <Badge
                  key={deg}
                  variant="outline"
                  className="text-xs border-[oklch(0.85_0.05_196)] bg-[oklch(0.97_0.02_196)]"
                  style={{ color: "var(--brand)" }}
                >
                  {deg}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-[oklch(0.922_0_0)]" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4" style={{ color: "var(--brand)" }} />
              <h2 className="text-sm font-bold text-[oklch(0.145_0_0)] uppercase tracking-wider">What this gets you</h2>
            </div>
            <ul className="space-y-2.5">
              {a.keyBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
                  <span className="text-sm text-[oklch(0.45_0_0)] leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="bg-[oklch(0.922_0_0)]" />

          <div>
            <h2 className="text-sm font-bold text-[oklch(0.145_0_0)] uppercase tracking-wider mb-3">Common questions</h2>
            <Card className="border-[oklch(0.922_0_0)] overflow-hidden bg-white shadow-none">
              <CardContent className="p-0 divide-y divide-[oklch(0.922_0_0)]">
                {a.sections.map((section) => (
                  <SectionRow key={section.id} section={section} />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[oklch(0.922_0_0)] bg-[oklch(0.985_0_0)] px-4 py-3.5 gap-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-[oklch(0.556_0_0)] flex-shrink-0" />
              <p className="text-sm text-[oklch(0.45_0_0)]">Read the official signed agreement</p>
            </div>
            <a
              href={a.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0 hover:underline"
              style={{ color: "var(--brand)" }}
            >
              View PDF
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              This page is for reference only. Last updated <strong>{a.lastUpdated}</strong>. Always confirm details with your academic advisor before making enrollment decisions.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
