import { Fragment } from "react"
import { TermTooltip } from "@/components/TermTooltip"

const COMBINED_PATTERN = new RegExp(
  [
    "articulation agreements?",
    "grade point average",
    "\\bGPA\\b",
    "degree audit",
    "prerequisites?",
  ].join("|"),
  "gi"
)

const TERM_ID_MAP: Record<string, string> = {
  "articulation agreement": "articulation-agreement",
  "articulation agreements": "articulation-agreement",
  prerequisite: "prerequisite",
  prerequisites: "prerequisite",
  "grade point average": "gpa",
  gpa: "gpa",
  "degree audit": "degree-audit",
}

export function withJargon(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let keyIndex = 0

  COMBINED_PATTERN.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = COMBINED_PATTERN.exec(text)) !== null) {
    const matchedText = match[0]
    const start = match.index

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start))
    }

    const termId = TERM_ID_MAP[matchedText.toLowerCase()]
    if (termId) {
      parts.push(
        <TermTooltip key={`jargon-${keyIndex++}`} termId={termId}>
          {matchedText}
        </TermTooltip>
      )
    } else {
      parts.push(matchedText)
    }

    lastIndex = start + matchedText.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  if (parts.length === 1 && typeof parts[0] === "string") {
    return text
  }

  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>
}
