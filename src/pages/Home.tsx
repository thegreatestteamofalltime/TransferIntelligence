import { ArrowRight, BookOpen, GitMerge, Bot, Users, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, TrendingUp, FileText, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogoHero } from "@/components/Logo"
import { navigate } from "@/lib/router"
import { TermTooltip } from "@/components/TermTooltip"

const features = [
  {
    icon: <GitMerge className="h-6 w-6" />,
    title: "Transfer Planning",
    description: "Map your classes from community college to your target 4-year university and see what counts.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Course Matching",
    description: "See which of your classes transfer — and get suggestions when a class doesn't have a direct match.",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Assistant",
    description: "Transfer Buddy answers your transfer questions 24/7 in plain language.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Advisor Support",
    description: "Connect with real academic advisors at Virginia institutions when you need a human answer.",
  },
]

const highlights = [
  {
    icon: <CheckCircle className="h-5 w-5" />,
    text: <><TermTooltip termId="articulation-agreement">School transfer agreements</TermTooltip> for Virginia colleges</>,
    color: "text-success",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    text: "Flags when transfer rules are unclear or conflicting",
    color: "text-warning",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    text: "Alternative class suggestions when a course doesn't match",
    color: "text-brand",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    text: "Plain-English glossary with hover definitions",
    color: "text-brand",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    text: "Advisor directory for 6 Virginia institutions",
    color: "text-brand",
  },
]

const steps = [
  { number: "01", title: "Enter Your School", description: "Tell us where you're currently enrolled." },
  { number: "02", title: "Choose Target", description: "Pick the Virginia university you want to transfer to." },
  { number: "03", title: "Input Courses", description: "Enter the courses you've taken or plan to take." },
  { number: "04", title: "Get Your Plan", description: "See which courses transfer and what to take next." },
]

export function HomePage() {
  return (
    <div className="flex flex-col">
      <section
        className="relative pt-8 pb-20 sm:pt-10 sm:pb-28 px-4 sm:px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.97 0.02 196) 0%, oklch(1 0 0) 50%, oklch(0.98 0.01 220) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, var(--brand) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.65 0.14 210) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">


          <div className="flex justify-center mb-2">
            <LogoHero />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground text-balance mb-4">
            See Which Credits Transfer
            <span style={{ color: "var(--brand)" }}> — Instantly</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Enter your Virginia community college courses. See what counts at your target 4-year school. Get a step-by-step transfer plan — free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="gap-2 text-white px-8 py-6 text-base"
              style={{ background: "var(--brand-gradient)" }}
              onClick={() => navigate("/planner")}
            >
              Start My Transfer Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 py-6 text-base"
              style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
              onClick={() => navigate("/get-started")}
            >
              How It Works
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="gap-2 px-8 py-6 text-base"
              onClick={() => navigate("/advisors")}
            >
              <Users className="h-4 w-4" />
              Talk to an Advisor
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Everything you need to transfer successfully
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              From course matching to advisor support — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-border shadow-none hover:shadow-sm transition-shadow duration-200 rounded-2xl">
                <CardContent className="p-7 flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white shadow-sm"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-base">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: "var(--brand-muted)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                className="mb-4 text-xs font-semibold"
                style={{ backgroundColor: "var(--brand)", color: "white" }}
              >
                How It Works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                Four steps to your transfer plan
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Enter your courses. See what transfers. Takes minutes.
              </p>
              <Button
                className="gap-2 text-white"
                style={{ background: "var(--brand-gradient)" }}
                onClick={() => navigate("/planner")}
              >
                Start Transfer Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {steps.map((step) => (
                <div key={step.number} className="bg-background rounded-xl p-5 border border-border">
                  <div
                    className="text-2xl font-black mb-2 leading-none"
                    style={{ color: "var(--brand)" }}
                  >
                    {step.number}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`flex-shrink-0 ${item.color}`}>{item.icon}</div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div>
              <Badge
                className="mb-4 text-xs font-semibold"
                style={{ backgroundColor: "var(--brand)", color: "white" }}
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                Built for students who find the process confusing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Transfer rules are complex and change often. TransferIntelligence combines current articulation agreement data, an AI assistant, and a real advisor network so you always know your next step — without surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4 sm:px-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, var(--brand) 0%, oklch(0.6 0.14 210) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Ready to see what transfers?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Enter your courses and get your transfer plan in minutes — free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-brand px-8 font-semibold hover:bg-white/90"
              style={{ color: "var(--brand)" }}
              onClick={() => navigate("/planner")}
            >
              Start Transfer Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10 hover:text-white px-8"
              onClick={() => navigate("/get-started")}
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
