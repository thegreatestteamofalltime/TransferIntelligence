import { Target, Zap, Shield, Heart, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogoHero } from "@/components/Logo"
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-8">
          <LogoHero />
        </div>
        <Badge
          className="mb-4 text-xs font-semibold"
          style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
        >
          About Us
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          About TransferIntelligence
        </h1>
        <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
          TransferIntelligence (TransInt) is a transfer planning platform built to help Virginia
          community college students navigate the complex journey of transferring to a 4-year university.
        </p>
      </div>

      <div className="prose-sm text-muted-foreground space-y-4 mb-12 leading-relaxed">
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
          <Card key={value.title}>
            <CardContent className="p-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {value.icon}
              </div>
              <h3 className="font-semibold mb-1">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        className="rounded-xl p-6 text-center"
        style={{ backgroundColor: "var(--brand-muted)" }}
      >
        <h3 className="font-semibold mb-2">Ready to plan your transfer?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start with the Planner to see a course-by-course transfer analysis, or browse
          our resources to learn more about the process.
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
