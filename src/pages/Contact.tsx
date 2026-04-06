import { Mail, MessageCircle, Users, ArrowRight, Circle as HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { navigate } from "@/lib/router"
import { openTransferBuddyChat } from "@/components/TransferBuddyLink"

const contactOptions = [
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "TransferBuddy",
    description: "Get instant answers to common transfer questions from our AI assistant — available anytime.",
    action: "Open Chat",
    handler: openTransferBuddyChat,
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Academic Advisors",
    description: "Connect with a real academic advisor at your target school for personalized guidance.",
    action: "View Advisors",
    handler: () => navigate("/advisors"),
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    title: "FAQ",
    description: "Browse our frequently asked questions for quick answers to common transfer questions.",
    action: "View FAQ",
    handler: () => navigate("/faq"),
  },
  {
    icon: <Mail className="h-5 w-5" />,
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
          <Card key={option.title} className="border border-border shadow-none hover:shadow-sm transition-shadow duration-200 rounded-2xl group">
            <CardContent className="p-7 flex flex-col items-center text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ background: "var(--brand-gradient)" }}
              >
                {option.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-base">{option.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {option.description}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 mt-auto"
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
