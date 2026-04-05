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
    description: "Tell us which community college you're currently attending or planning to leave from. We support all major Virginia community colleges.",
    detail: "Example: Brightpoint Community College, Northern Virginia Community College (NOVA)",
  },
  {
    number: 2,
    icon: <BookOpen className="h-7 w-7" />,
    title: "Select Your Target School",
    description: "Choose the 4-year Virginia university you want to attend and the program (major) you're interested in.",
    detail: "Example: Virginia State University (VSU) — Computer Science",
  },
  {
    number: 3,
    icon: <FileSearch className="h-7 w-7" />,
    title: "Enter Your Classes",
    description: "Add the classes you've completed or are currently taking. Use course codes like ENG 111, MTH 167, CSC 201. Don't worry — we'll guide you.",
    detail: "Example: ENG 111, MTH 167, CSC 201, ITE 115",
  },
  {
    number: 4,
    icon: <CheckCircle2 className="h-7 w-7" />,
    title: "View Your Transfer Plan",
    description: (
      <>See which of your classes count at the new school, which need review, and which don't transfer. We also suggest what classes to take to fill any gaps.</>
    ),
    detail: "ENG 111 → VSU ENGL 110 (Accepted), CSC 223 → VSU CSCI 250 + CSCI 251 (Expanded)",
  },
]

const tips = [
  "Keep a copy of your unofficial transcript handy when entering your classes",
  "Check with your advisor before dropping any classes based on this tool",
  "Transfer rules change — always confirm with your target school before making big decisions",
  "Finishing your Associate's degree before transferring gives you the strongest chance of full credit acceptance",
]

export function GetStartedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <Badge
          className="mb-4 text-xs font-semibold"
          style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
        >
          Getting Started
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          How TransferIntelligence Works
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Follow these four steps to build your personalized transfer plan in minutes.
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

      <Alert className="mb-8 border-brand" style={{ borderColor: "var(--brand)", backgroundColor: "var(--brand-muted)" }}>
        <Lightbulb className="h-4 w-4" style={{ color: "var(--brand)" }} />
        <AlertDescription className="text-sm">
          <strong style={{ color: "var(--brand)" }}>Pro Tip:</strong>{" "}
          Completing an Associate of Science (A.S.) or Associate of Arts (A.A.) degree at your community college before transferring can guarantee admission to many Virginia universities through the VCCS Transfer Pathways program. Finishing the degree means more of your classes are guaranteed to count at your new school.
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
          style={{ backgroundColor: "var(--brand)" }}
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
