import { Circle as HelpCircle, MessageCircle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/data/faq"
import { navigate } from "@/lib/router"
import { withJargon } from "@/lib/jargon"

const categories = [...new Set(faqs.map((f) => f.category))]

export function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <Badge
          className="mb-4 text-xs font-semibold"
          style={{ backgroundColor: "var(--brand-muted)", color: "var(--brand)" }}
        >
          FAQ
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Answers to common questions about college transfer in Virginia. Can't find what you need?
          Ask Transfer Buddy or contact an advisor.
        </p>
      </div>

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
        className="rounded-xl p-6 text-center mt-6"
        style={{ backgroundColor: "var(--brand-muted)" }}
      >
        <MessageCircle className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--brand)" }} />
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ask Transfer Buddy — our AI assistant — or connect with a real academic advisor.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="sm"
            className="gap-2 text-white"
            style={{ backgroundColor: "var(--brand)" }}
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
  )
}
