import { Target, Zap, Shield, Heart, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { navigate } from "@/lib/router"
import { TermTooltip } from "@/components/TermTooltip"

const values = [
  {
    icon: <Target className="h-5 w-5" />,
    title: "Accuracy",
    description: "We source data directly from published Virginia school agreements and flag outdated or conflicting policies.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Simplicity",
    description: "Transfer planning is complex. We cut through the noise so you can focus on what matters: getting to your goal.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Transparency",
    description: "We always tell you when data is incomplete, outdated, or needs advisor review. No false confidence.",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Accessibility",
    description: "Built for first-generation students, working adults, and anyone who finds the transfer process overwhelming.",
  },
]

export function AboutPage() {
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
            About <span style={{ color: "var(--brand)" }}>TransferIntelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A transfer planning platform built to help Virginia community college students navigate
            the complex journey of transferring to a 4-year university.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="prose-sm text-muted-foreground space-y-4 mb-12 leading-relaxed text-base">
            <p>
              Every year, thousands of Virginia students move from community colleges to universities —
              but many lose credits, waste semesters, or miss opportunities because the process is
              confusing and hard to navigate. <TermTooltip termId="articulation-agreement">Formal school agreements</TermTooltip> exist that protect your credits,
              but they're buried in PDFs, change without notice, and are hard to read without expert help.
            </p>
            <p>
              We built TransferIntelligence to change that. By combining that agreement data with
              AI-powered guidance and a network of academic advisors, we help students build confident,
              accurate transfer plans — from day one.
            </p>
            <p>
              This prototype focuses on Virginia's community college system and supports common transfer
              pathways between Brightpoint, NOVA, and Virginia State University.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {values.map((value) => (
              <Card key={value.title} className="border border-border shadow-none hover:shadow-sm transition-shadow rounded-2xl">
                <CardContent className="p-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    {value.icon}
                  </div>
                  <h3 className="font-semibold mb-1.5">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: "var(--brand-muted)" }}
          >
            <h3 className="font-semibold text-lg mb-2">Ready to plan your transfer?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Start with the Planner to see a course-by-course transfer analysis, or browse
              our resources to learn more about the process.
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
        </div>
      </section>
    </div>
  )
}
