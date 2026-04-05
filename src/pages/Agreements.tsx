import { FileText, CircleCheck as CheckCircle2, GraduationCap, CalendarDays, BookOpen, ChevronDown, ExternalLink, ShieldCheck, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { VCCS_VSU_GAA, type ArticulationAgreement, type GAASection } from "@/data/agreements/vccs-vsu-gaa"

function SectionItem({ section }: { section: GAASection }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors rounded-lg">
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">{section.title}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{section.summary}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function AgreementCard({ agreement }: { agreement: ArticulationAgreement }) {
  const req = agreement.admissionRequirements

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className="text-xs font-semibold"
                  style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
                >
                  {agreement.type}
                </Badge>
                <Badge variant="outline" className="text-xs border-success/40 text-success bg-success/5">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <CardTitle className="text-xl leading-snug">{agreement.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {agreement.sourceSystem} → {agreement.targetInstitution}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Last updated: <strong className="text-foreground">{agreement.lastUpdated}</strong></span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: "var(--brand)" }} />
              Covered Institutions
            </h3>
            <div className="flex flex-wrap gap-2">
              {agreement.sourceInstitutions.map((inst) => (
                <Badge key={inst} variant="secondary" className="text-xs font-normal">
                  {inst}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" style={{ color: "var(--brand)" }} />
              Admission Requirements
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground mb-0.5">Minimum GPA</div>
                <div className="text-lg font-bold text-foreground">{req.minimumGPA.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">on a 4.0 scale</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground mb-0.5">Min. Credits at VCCS</div>
                <div className="text-lg font-bold text-foreground">{req.minimumCreditsAtVCCS}</div>
                <div className="text-xs text-muted-foreground">credit hours</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground mb-0.5">Max. Transfer Credits</div>
                <div className="text-lg font-bold text-foreground">{req.maximumTransferCredits}</div>
                <div className="text-xs text-muted-foreground">credit hours</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground mb-0.5">Min. Course Grade</div>
                <div className="text-lg font-bold text-foreground">{req.courseGradeMinimum}</div>
                <div className="text-xs text-muted-foreground">for a course to transfer</div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground mb-2">Standardized Testing</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">No standardized testing required</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Application Deadlines
              </div>
              <div className="flex flex-wrap gap-3">
                {req.applicationDeadlines.map((d) => (
                  <div key={d.term} className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">{d.term}:</span>
                    <span className="text-xs text-muted-foreground">{d.deadline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" style={{ color: "var(--brand)" }} />
              Eligible Degree Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {req.applicableDegrees.map((deg) => (
                <Badge
                  key={deg}
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: "oklch(0.72 0.14 196 / 0.4)", color: "var(--brand)" }}
                >
                  {deg}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Key Benefits for Students
            </h3>
            <ul className="space-y-2">
              {agreement.keyBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" style={{ color: "var(--brand)" }} />
            Agreement Sections
          </CardTitle>
          <p className="text-xs text-muted-foreground">Expand each section to read a summary.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {agreement.sections.map((section) => (
              <SectionItem key={section.id} section={section} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3">
        <FileText className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Official Agreement Document</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            The signed GAA document (last updated {agreement.lastUpdated}) is maintained in the
            Transfer Virginia Portal. Contact an academic advisor for the most current version.
          </p>
        </div>
        <a
          href={agreement.pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 hover:underline"
          style={{ color: "var(--brand)" }}
        >
          View PDF
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Data Currency Notice:</strong> The articulation agreement information on this page reflects
          the VCCS–VSU Guaranteed Admission Agreement as last updated <strong>{agreement.lastUpdated}</strong>.
          This data is for reference purposes only. Always confirm current requirements with an academic
          advisor or the receiving institution before making enrollment decisions.
        </p>
      </div>
    </div>
  )
}

export function AgreementsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Badge
          className="mb-3 text-xs font-semibold"
          style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
        >
          Articulation Agreements
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Transfer Agreements</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed max-w-xl">
          Official articulation agreements define how credits transfer between institutions and outline
          guaranteed admission pathways for qualifying students.
        </p>
      </div>

      <AgreementCard agreement={VCCS_VSU_GAA} />
    </div>
  )
}
