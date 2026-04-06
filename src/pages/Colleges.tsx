import { MapPin, GraduationCap, Building2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { colleges } from "@/data/colleges"
import { navigate } from "@/lib/router"
import { TermTooltip } from "@/components/TermTooltip"

export function CollegesPage() {
  const communityColleges = colleges.filter((c) => c.type === "Community College")
  const universities = colleges.filter((c) => c.type === "University")

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">

        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Colleges & Universities</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Virginia institutions supported by TransferIntelligence. We have <TermTooltip termId="articulation-agreement">formal transfer agreements</TermTooltip> on file for all of these community college and university pairings.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "var(--brand)" }}>
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Community Colleges</h2>
            <p className="text-xs text-muted-foreground">Transfer-sending institutions</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {communityColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </div>

      <Separator className="mb-10" />

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "oklch(0.55 0.15 145)" }}>
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Universities</h2>
            <p className="text-xs text-muted-foreground">Transfer-receiving institutions</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {universities.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-6 text-center"
        style={{ backgroundColor: "var(--brand-muted)" }}
      >
        <h3 className="font-semibold mb-2">Ready to see how your courses transfer?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use the Planner to see exactly which of your classes count between any two supported schools.
        </p>
        <Button
          className="gap-2 text-white"
          style={{ backgroundColor: "var(--brand)" }}
          onClick={() => navigate("/planner")}
        >
          Start Transfer Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function CollegeCard({ college }: { college: (typeof colleges)[0] }) {
  const isCC = college.type === "Community College"

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 font-bold text-sm"
            style={{ backgroundColor: isCC ? "var(--brand)" : "oklch(0.55 0.15 145)" }}
          >
            {college.abbreviation.substring(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{college.name}</h3>
            <Badge
              variant="outline"
              className="text-xs mt-1"
              style={
                isCC
                  ? { borderColor: "var(--brand)", color: "var(--brand)" }
                  : { borderColor: "oklch(0.55 0.15 145)", color: "oklch(0.45 0.15 145)" }
              }
            >
              {college.type}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{college.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          {college.location}
        </div>
      </CardContent>
    </Card>
  )
}
