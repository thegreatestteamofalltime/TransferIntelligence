import { Circle as HelpCircle, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/data/faq"
import { navigate } from "@/lib/router"
import { withJargon } from "@/lib/jargon"

const categories = [...new Set(faqs.map((f) => f.category))]

export function FAQPage() {
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
            Frequently Asked <span style={{ color: "var(--brand)" }}>Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Common questions about Virginia college transfer. Still stuck? Ask Transfer Buddy or contact an advisor.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
      {categories.map((category) => {
        const categoryFaqs = faqs.filter((f) => f.category === category)
        return (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-4 w-4" style={{ color: "var(--brand)" }} />
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {categoryFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-border rounded-xl px-4 overflow-hidden"
                >
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                    {withJargon(faq.question)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {withJargon(faq.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )
      })}

      <div
        className="rounded-2xl p-8 text-center mt-6"
        style={{ backgroundColor: "var(--brand-muted)" }}
      >
        <MessageCircle className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--brand)" }} />
        <h3 className="font-semibold text-lg mb-1">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-5">
          Ask Transfer Buddy or connect with a real academic advisor.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="sm"
            className="gap-2 text-white"
            style={{ background: "var(--brand-gradient)" }}
            onClick={() => navigate("/advisors")}
          >
            Contact an Advisor
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
            onClick={() => navigate("/terminology")}
          >
            View Terminology
          </Button>
        </div>
      </div>
        </div>
      </section>
    </div>
  )
}
