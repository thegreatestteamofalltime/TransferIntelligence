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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">

        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Contact & Support</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Have questions? We're here to help. Choose the option that works best for you.
        </p>
      </div>

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
  )
}
