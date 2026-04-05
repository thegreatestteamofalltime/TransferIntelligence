import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { terms } from "@/data/terminology"
import { navigate } from "@/lib/router"

interface TermTooltipProps {
  termId?: string
  termName?: string
  children?: React.ReactNode
}

export function TermTooltip({ termId, termName, children }: TermTooltipProps) {
  const term = termId
    ? terms.find((t) => t.id === termId)
    : terms.find((t) => t.term.toLowerCase() === termName?.toLowerCase())

  if (!term) return <>{children}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="border-b border-dashed cursor-pointer font-medium"
          style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
          onClick={() => navigate("/terminology")}
        >
          {children ?? term.term}
        </span>
      </TooltipTrigger>
      <TooltipContent
        className="max-w-72 p-4 bg-white text-foreground shadow-lg border border-border"
        side="top"
      >
        <p className="font-semibold text-sm mb-1.5">{term.term}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{term.shortDefinition}</p>
        <p className="text-xs mt-2" style={{ color: "var(--brand)" }}>Click to see full definition →</p>
      </TooltipContent>
    </Tooltip>
  )
}
