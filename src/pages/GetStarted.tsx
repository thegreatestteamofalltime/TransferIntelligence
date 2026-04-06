import { School, BookOpen, FileSearch, CircleCheck as CheckCircle2, ArrowRight, Lightbulb, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { navigate } from "@/lib/router"

const steps = [
  {
    number: 1,
    icon: <School className="h-7 w-7" />,
    title: "Enter Your Current College",
    description: "Pick which Virginia community college you attend.",
    detail: "Example: Brightpoint Community College, NOVA",
  },
  {
    number: 2,
    icon: <BookOpen className="h-7 w-7" />,
    title: "Choose Your Target School",
    description: "Select the 4-year university and major you're transferring into.",
    detail: "Example: Virginia State University — Computer Science",
  },
  {
    number: 3,
    icon: <FileSearch className="h-7 w-7" />,
    title: "Enter Your Courses",
    description: "Add the courses you've completed or are taking. Use standard course codes — we'll help identify them.",
    detail: "Example: ENG 111, MTH 167, CSC 201, ITE 115",
  },
  {
    number: 4,
    icon: <CheckCircle2 className="h-7 w-7" />,
    title: "Get Your Transfer Plan",
    description: "See which credits transfer, which need review, and what courses to take next to fill gaps.",
    detail: "ENG 111 → VSU ENGL 110 (Accepted), CSC 223 → VSU CSCI 250 + CSCI 251 (Expanded)",
  },
]

const tips = [
  "Have your unofficial transcript handy when entering courses",
  "Confirm results with your advisor before making enrollment decisions",
  "Transfer rules change — always verify with your target school",
  "Finishing your Associate's degree before transferring maximizes accepted credits",
]

export function GetStartedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          How It Works
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Four steps to your transfer plan.
        </p>
      </div>

      <div className="relative space-y-6 mb-12">
        <div className="absolute left-[2.35rem] top-12 bottom-12 w-0.5 bg-border hidden sm:block" />

        {steps.map((step) => (
          <div key={step.number} className="relative flex gap-6 sm:gap-8">
            <div className="flex-shrink-0 relative z-10">
              <div
                className="w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {step.icon}
              </div>
            </div>
            <Card className="flex-1">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                  <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                    Step {step.number}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {step.description}
                </p>
                <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono border border-border">
                  {step.detail}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Alert className="mb-8" style={{ borderColor: "var(--brand)", backgroundColor: "var(--brand-muted)" }}>
        <Lightbulb className="h-4 w-4" style={{ color: "var(--brand)" }} />
        <AlertDescription className="text-sm">
          <strong style={{ color: "var(--brand)" }}>Tip:</strong>{" "}
          Completing your Associate's degree before transferring gives you the best chance of full credit acceptance through the VCCS Transfer Pathways program.
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Tips for a Smooth Transfer</h3>
          </div>
          <ul className="space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="gap-2 text-white px-8"
          style={{ background: "var(--brand-gradient)" }}
          onClick={() => navigate("/planner")}
        >
          Start Transfer Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="gap-2 px-8"
          style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
          onClick={() => navigate("/terminology")}
        >
          <BookOpen className="h-4 w-4" />
          View Terminology
        </Button>
      </div>
    </div>
  )
}
