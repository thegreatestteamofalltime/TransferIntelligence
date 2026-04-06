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
            "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">


          <div className="flex justify-center mb-4">
            <LogoHero />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white text-balance mb-6">
            Plan Your College Transfer with Confidence
          </h1>

          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            See exactly which classes count at your new school. Get AI help, real advisor support, and clear guidance every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="gap-2 bg-white text-brand px-8 py-6 text-base font-semibold hover:bg-white/90"
              onClick={() => navigate("/get-started")}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 py-6 text-base border-white text-white hover:bg-white/10"
              onClick={() => navigate("/colleges")}
            >
              Browse Colleges
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="gap-2 px-8 py-6 text-base text-white hover:bg-white/10"
              onClick={() => navigate("/advisors")}
            >
              <Users className="h-4 w-4" />
              Contact Advisor
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              Everything You Need to Transfer Successfully
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
              Built for community college students like you. Simple tools, real answers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-border bg-white hover:shadow-md transition-all duration-200 rounded-xl">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
                    }}
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

      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                className="mb-4 text-xs font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
                }}
              >
                How It Works
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Four Simple Steps to Your Transfer Plan
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                Our streamlined process takes the guesswork out of transferring. From entering your courses to seeing your complete transfer plan — it takes minutes.
              </p>
              <Button
                className="gap-2 text-white font-semibold"
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
                }}
                onClick={() => navigate("/planner")}
              >
                Start Transfer Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {steps.map((step) => (
                <div key={step.number} className="bg-white rounded-lg p-6 border border-border">
                  <div
                    className="text-3xl font-black mb-3 leading-none"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {step.number}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>

            <div>
              <Badge
                className="mb-4 text-xs font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
                }}
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Transfer Planning for Everyone
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-base">
                We built TransferIntelligence for first-generation college students, working students, and anyone who finds the transfer process confusing. Transfer policies are complex — but your path forward shouldn't be.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                By combining up-to-date school agreement data with an AI assistant and a network of academic advisors, we give every student the information they need to transfer confidently — without surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4 sm:px-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, oklch(0.68 0.14 196) 0%, oklch(0.65 0.14 210) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Plan Your Transfer?
          </h2>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">
            See your transfer plan in minutes. Free. Instant. Built for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-brand px-8 py-6 font-semibold hover:bg-white/90"
              onClick={() => navigate("/planner")}
            >
              Start Transfer Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6"
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
