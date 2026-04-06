import { School, BookOpen, FileSearch, CircleCheck as CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { navigate } from "@/lib/router"

const steps = [
  {
    number: "01",
    icon: <School className="h-6 w-6" />,
    title: "Enter Your Current College",
    description: "Pick which Virginia community college you attend and your current degree program.",
  },
  {
    number: "02",
    icon: <BookOpen className="h-6 w-6" />,
    title: "Choose Your Target School",
    description: "Select the 4-year university and major you're aiming to transfer into.",
  },
  {
    number: "03",
    icon: <FileSearch className="h-6 w-6" />,
    title: "Enter Your Courses",
    description: "Add the courses you've completed or are taking. We use standard course codes like ENG 111 or CSC 201.",
  },
  {
    number: "04",
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Get Your Transfer Plan",
    description: "See which credits transfer, which need review, and what courses to take next to fill gaps.",
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
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance mb-4">
            How It <span style={{ color: "var(--brand)" }}>Works</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Four steps to your transfer plan. Fast, clear, and free.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Four steps to your transfer plan
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Enter your courses. See what transfers. Takes minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {steps.map((step) => (
              <Card key={step.number} className="border border-border shadow-none hover:shadow-sm transition-shadow duration-200 rounded-2xl">
                <CardContent className="p-7 flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="text-3xl font-black mb-2 leading-none"
                    style={{ color: "var(--brand)" }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-base">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div
            className="rounded-2xl p-8 mb-10"
            style={{ backgroundColor: "var(--brand-muted)" }}
          >
            <h3 className="font-semibold text-lg mb-4">Tips for a Smooth Transfer</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

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
      </section>
    </div>
  )
}
