import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TermTooltip } from "@/components/TermTooltip"
import { degreePlans } from "@/data/degrees"

const SOURCE_SCHOOLS = [
  "Brightpoint Community College",
  "Northern Virginia Community College",
]
const TARGET_SCHOOLS = ["Virginia State University"]
const PROGRAMS = ["Computer Science"]

const sourceDegreesFor = (school: string) =>
  degreePlans.filter((d) => d.school === school)

interface Props {
  currentSchool: string
  setCurrentSchool: (v: string) => void
  currentDegreeId: string
  setCurrentDegreeId: (v: string) => void
  targetSchool: string
  setTargetSchool: (v: string) => void
  program: string
  setProgram: (v: string) => void
  onNext: () => void
}

export function PlannerStep1({
  currentSchool,
  setCurrentSchool,
  currentDegreeId,
  setCurrentDegreeId,
  targetSchool,
  setTargetSchool,
  program,
  setProgram,
  onNext,
}: Props) {
  const sourceDegrees = sourceDegreesFor(currentSchool)

  const handleSchoolChange = (school: string) => {
    setCurrentSchool(school)
    const degrees = sourceDegreesFor(school)
    if (degrees.length > 0) setCurrentDegreeId(degrees[0].id)
  }

  return (
    <div className="flex flex-col">
      <section
        className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.97 0.02 196) 0%, oklch(1 0 0) 50%, oklch(0.98 0.01 220) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, var(--brand) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.65 0.14 210) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance mb-4">
            Build Your <span style={{ color: "var(--brand)" }}>Transfer Plan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Select your schools, current degree, and program to get a personalized plan — based on the official{" "}
            <TermTooltip termId="articulation-agreement">school transfer agreement</TermTooltip>.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
      <div className="max-w-2xl mx-auto">

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          <div className="flex-1 h-1.5 rounded-full bg-muted" />
          <div className="flex-1 h-1.5 rounded-full bg-muted" />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-1">Step 1 of 3 — Schools &amp; Degree</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <label className="text-sm font-semibold block mb-2">Current School</label>
            <Select value={currentSchool} onValueChange={handleSchoolChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_SCHOOLS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">Current Degree</label>
            <Select value={currentDegreeId} onValueChange={setCurrentDegreeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current degree program" />
              </SelectTrigger>
              <SelectContent>
                {sourceDegrees.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.degree} — {d.program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {sourceDegrees.find((d) => d.id === currentDegreeId) && (
              <p className="text-xs text-muted-foreground mt-1.5">
                {sourceDegrees.find((d) => d.id === currentDegreeId)?.totalCredits} total credits required
              </p>
            )}
          </div>

          <Separator />

          <div>
            <label className="text-sm font-semibold block mb-2">Target School</label>
            <Select value={targetSchool} onValueChange={setTargetSchool}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TARGET_SCHOOLS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">Program (Major)</label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full gap-2 text-white py-5 text-base"
            style={{ background: "var(--brand-gradient)" }}
            onClick={onNext}
            disabled={!currentDegreeId}
          >
            Next: Select Completed Courses
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed px-4">
        Transfer equivalency is for reference only. Final decisions are made by your target school after reviewing your official transcript.
      </p>
      </div>
      </section>
    </div>
  )
}
