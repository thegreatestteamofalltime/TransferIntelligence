import { useState } from "react"
import { ArrowRight, Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TermTooltip } from "@/components/TermTooltip"
import { degreePlans } from "@/data/degrees"
import { cn } from "@/lib/utils"

const SOURCE_SCHOOLS = [
  "Brightpoint Community College",
  "Northern Virginia Community College",
]

const TARGET_SCHOOLS = [
  { id: "Virginia State University", label: "Virginia State University", available: true },
]

const PROGRAMS = ["Computer Science"]

const sourceDegreesFor = (school: string) =>
  degreePlans.filter((d) => d.school === school)

interface Props {
  currentSchool: string
  setCurrentSchool: (v: string) => void
  currentDegreeId: string
  setCurrentDegreeId: (v: string) => void
  targetSchools: string[]
  setTargetSchools: (v: string[]) => void
  program: string
  setProgram: (v: string) => void
  onNext: () => void
}

export function PlannerStep1({
  currentSchool,
  setCurrentSchool,
  currentDegreeId,
  setCurrentDegreeId,
  targetSchools,
  setTargetSchools,
  program,
  setProgram,
  onNext,
}: Props) {
  const sourceDegrees = sourceDegreesFor(currentSchool)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [search, setSearch] = useState("")

  const handleSchoolChange = (school: string) => {
    setCurrentSchool(school)
    const degrees = sourceDegreesFor(school)
    if (degrees.length > 0) setCurrentDegreeId(degrees[0].id)
  }

  const toggleTargetSchool = (schoolId: string) => {
    if (targetSchools.includes(schoolId)) {
      setTargetSchools(targetSchools.filter((s) => s !== schoolId))
    } else {
      setTargetSchools([...targetSchools, schoolId])
    }
  }

  const filteredSchools = TARGET_SCHOOLS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  )

  const triggerLabel =
    targetSchools.length === 0
      ? "Select target schools"
      : targetSchools.length === 1
      ? targetSchools[0]
      : `${targetSchools.length} schools selected`

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
                <label className="text-sm font-semibold block mb-1">Target Schools</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select one or more transfer destinations. More schools will be added over time.
                </p>

                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between font-normal text-left"
                    >
                      <span className={cn("truncate", targetSchools.length === 0 && "text-muted-foreground")}>
                        {triggerLabel}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search schools..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-8 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-1 max-h-60 overflow-y-auto">
                      {filteredSchools.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No schools found.</p>
                      ) : (
                        filteredSchools.map((school) => (
                          <div
                            key={school.id}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-accent",
                              !school.available && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => school.available && toggleTargetSchool(school.id)}
                          >
                            <Checkbox
                              checked={targetSchools.includes(school.id)}
                              onCheckedChange={() => school.available && toggleTargetSchool(school.id)}
                              disabled={!school.available}
                              id={`school-${school.id}`}
                            />
                            <label
                              htmlFor={`school-${school.id}`}
                              className="text-sm flex-1 cursor-pointer"
                            >
                              {school.label}
                            </label>
                            {targetSchools.includes(school.id) && (
                              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--brand)" }} />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {targetSchools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {targetSchools.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-xs gap-1 cursor-pointer"
                        onClick={() => toggleTargetSchool(s)}
                      >
                        {s}
                        <span className="text-muted-foreground hover:text-foreground">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
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
                disabled={!currentDegreeId || targetSchools.length === 0}
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
