import { Mail, MessageCircle, Users, ArrowRight, Circle as HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { navigate } from "@/lib/router"

const contactOptions = [
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Transfer Buddy",
    description: "Get instant answers to common transfer questions from our AI assistant — available anytime.",
    action: "Open Chat",
    handler: () => {
      const btn = document.querySelector('[aria-label="Open Transfer Buddy chat"]') as HTMLButtonElement
      btn?.click()
    },
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Academic Advisors",
    description: "Connect with a real academic advisor at your target school for personalized guidance.",
    action: "View Advisors",
    handler: () => navigate("/advisors"),
  },
  {
    icon: <HelpCircle className="h-6 w-6" />,
    title: "FAQ",
    description: "Browse our frequently asked questions for quick answers to common transfer questions.",
    action: "View FAQ",
    handler: () => navigate("/faq"),
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "General Inquiry",
    description: "Have a question about TransferIntelligence? Reach our team directly by email.",
    action: "Send Email",
    handler: () => window.open("mailto:hello@transferintelligence.edu", "_blank"),
  },
]

export function ContactPage() {
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
            Contact &amp; <span style={{ color: "var(--brand)" }}>Support</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have questions? We're here to help. Choose the option that works best for you.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {contactOptions.map((option) => (
          <Card key={option.title} className="overflow-hidden hover:shadow-md transition-shadow group">
            <CardContent className="p-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {option.icon}
              </div>
              <h3 className="font-semibold mb-2">{option.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {option.description}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 w-full group-hover:border-brand"
                style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                onClick={option.handler}
              >
                {option.action}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-6 bg-muted/30 rounded-xl border border-border">
        <p className="text-sm text-muted-foreground">
          TransferIntelligence is a hackathon prototype. For official transfer guidance, always
          consult your institution's academic advising office directly.
        </p>
      </div>
        </div>
      </section>
    </div>
  )
}
