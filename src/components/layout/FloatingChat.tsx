import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { navigate } from "@/lib/router"

interface Message {
  id: string
  role: "user" | "assistant"
  text: string
  showAdvisor?: boolean
}

const ADVISOR_KEYWORDS = ["complex", "unclear", "conflict", "ambiguous", "confused", "help me", "not sure", "don't understand", "complicated", "worried", "nervous"]

function getAIResponse(input: string): { text: string; showAdvisor: boolean } {
  const lower = input.toLowerCase()

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return {
      text: "Hi! I'm Transfer Buddy. I can help you understand which of your Brightpoint classes transfer to Virginia State University (VSU), and what to expect from the process. What would you like to know?",
      showAdvisor: false,
    }
  }

  if (lower.includes("what can you do") || lower.includes("what do you do")) {
    return {
      text: "I can help you understand: which Brightpoint courses transfer to VSU, what 'expanded credit' means, how to read your transfer plan results, and when to contact an advisor. Try asking me about a specific class like 'What does CSC 201 transfer as?'",
      showAdvisor: false,
    }
  }

  if (lower.includes("csc 201") || lower.includes("csc201")) {
    return {
      text: "CSC 201 (Computer Science I) transfers to VSU as two courses: CSCI 150 (Programming I) and CSCI 151 (Programming I Lab). This is called 'Expanded Credit' — one class at Brightpoint counts for a lecture AND a lab at VSU. Keep in mind that this doesn't mean you've completed the full programming sequence — an advisor can tell you what else you may need.",
      showAdvisor: false,
    }
  }

  if (lower.includes("csc 202") || lower.includes("csc202")) {
    return {
      text: "CSC 202 (Computer Science II) transfers to VSU as two courses: CSCI 250 (Programming II) and CSCI 251 (Programming II Lab). Like CSC 201, this is 'Expanded Credit' — one Brightpoint class counts for both a lecture and a lab at VSU.",
      showAdvisor: false,
    }
  }

  if (lower.includes("csc 222") || lower.includes("csc222")) {
    return {
      text: "CSC 222 (Object-Oriented Programming I) transfers to VSU as three courses: CSCI 150 (Programming I), CSCI 151 (Programming I Lab), and ENGR 204 (Object-Oriented Programming). This is an especially strong transfer — one Brightpoint class satisfies three VSU requirements.",
      showAdvisor: false,
    }
  }

  if (lower.includes("csc 223") || lower.includes("csc223")) {
    return {
      text: "CSC 223 (Object-Oriented Programming II) transfers to VSU as CSCI 250 (Programming II) and CSCI 251 (Programming II Lab) — both lecture and lab credit from one class.",
      showAdvisor: false,
    }
  }

  if (lower.includes("csc 221") || lower.includes("csc221")) {
    return {
      text: "CSC 221 (Information Systems) transfers to VSU as CSCI 150 (Programming I) only. It transfers, but may not fully satisfy upper-level programming requirements. For a stronger fit, consider taking CSC 201 or CSC 222 instead.",
      showAdvisor: true,
    }
  }

  if (lower.includes("csc 205") || lower.includes("csc205")) {
    return {
      text: "CSC 205 (Computer Organization) transfers directly to VSU as CSCI 303 (Computer Organization & Architecture). This is a clean, direct match.",
      showAdvisor: false,
    }
  }

  if (lower.includes("csc 208") || lower.includes("csc208")) {
    return {
      text: "CSC 208 (Discrete Mathematics) transfers directly to VSU as CSCI 281 (Discrete Structures). Direct match — no issues.",
      showAdvisor: false,
    }
  }

  if (lower.includes("expanded") || lower.includes("expanded credit") || lower.includes("multiple courses") || lower.includes("lecture and lab")) {
    return {
      text: "Some of your Brightpoint courses transfer as multiple courses at VSU — for example, one class may count for both a lecture course and a lab course. This is called 'Expanded Transfer Credit.' It's a good thing: you get more credit for the work you've already done. However, receiving expanded credit doesn't mean you've completed the full degree sequence — an advisor can clarify what additional courses you'll need.",
      showAdvisor: false,
    }
  }

  if (lower.includes("nova") || lower.includes("northern virginia community college") || lower.includes("nvcc")) {
    return {
      text: "Northern Virginia Community College (NOVA) offers a Computer Science A.S. degree (NOVA Code 2460) that is designed for transfer. The core sequence is CSC 221 → CSC 222 → CSC 223, plus CSC 208 and math courses. All of these have real VSU equivalencies — use the Planner and select NOVA as your school to see the full breakdown.",
      showAdvisor: false,
    }
  }

  if (lower.includes("nova degree") || lower.includes("nova cs") || lower.includes("nova computer science")) {
    return {
      text: "NOVA's Computer Science A.S. is a 60–63 credit transfer degree. The CS core includes: CSC 221 (Intro to Programming), CSC 222 (Object Oriented Programming), CSC 208 (Discrete Structures), CSC 223 (Data Structures), and a choice of CSC 205, CSC 215, or MTH 265 in the 4th semester. You also take Calculus I & II, two English composition courses, and a lab science.",
      showAdvisor: false,
    }
  }

  if (lower.includes("vsu degree") || lower.includes("vsu cs") || lower.includes("vsu computer science")) {
    return {
      text: "VSU's Computer Science B.S. is a 120-credit program. As a freshman you take CSCI 150/151 (Programming), CSCI 250/251 (Programming II), and Calculus I & II. By sophomore year you cover CSCI 281 (Discrete Structures), CSCI 287 (Data Structures), CSCI 303 (Org & Architecture), and Web/Database courses. Transfer students typically enter at the sophomore or junior level.",
      showAdvisor: true,
    }
  }

  if (lower.includes("vsu") || lower.includes("virginia state")) {
    return {
      text: "Virginia State University (VSU) in Petersburg, VA has real transfer equivalency data for CS courses from both Brightpoint and NOVA. Several courses transfer directly, and some give you credit for multiple VSU courses at once. Use the Planner tool — select your school and 'Virginia State University' as the target to see the full picture.",
      showAdvisor: false,
    }
  }

  if (lower.includes("brightpoint")) {
    return {
      text: "Brightpoint Community College has transfer agreements with several Virginia universities, including Virginia State University (VSU). The Planner tool uses real course equivalency data for the Brightpoint → VSU Computer Science pathway. Check the Colleges page for a full list of supported schools.",
      showAdvisor: false,
    }
  }

  if (lower.includes("articulation") || lower.includes("transfer agreement")) {
    return {
      text: "A transfer agreement (sometimes called an articulation agreement) is an official deal between two schools that spells out exactly which courses transfer and how they count. Brightpoint and VSU have a real agreement for Computer Science — that's the data powering the Planner tool.",
      showAdvisor: false,
    }
  }

  if (lower.includes("prerequisite") || lower.includes("pre-req") || lower.includes("prereq")) {
    return {
      text: "A prerequisite is a class you need to finish before you can take a more advanced one. For example, you'd typically need Programming I before taking Programming II. When you transfer, VSU will check that your transcript shows you've completed the right prerequisites for the classes you want to take.",
      showAdvisor: false,
    }
  }

  if (lower.includes("gpa") || lower.includes("grade point")) {
    return {
      text: "Most Virginia universities require at least a 2.0 GPA to transfer. Competitive programs like Computer Science may require a 3.0 or higher. If you've earned an Associate's degree with a qualifying GPA, you may have guaranteed transfer options through Virginia's Transfer Pathways program.",
      showAdvisor: false,
    }
  }

  if (lower.includes("credit") || lower.includes("credits")) {
    return {
      text: "Credits measure how much a course counts toward your degree. Most classes are worth 3 credits. When you transfer, your new school reviews which credits they'll accept. Some of your Brightpoint classes may even count as multiple credits at VSU — use the Planner to see the details.",
      showAdvisor: false,
    }
  }

  if (lower.includes("degree") || lower.includes("complete") || lower.includes("finish")) {
    return {
      text: "Receiving transfer credit for a course does not automatically mean you've completed your degree. Transfer equivalency shows which classes count — but your advisor will need to review your full plan to confirm you're on track to graduate. Transfer credit ≠ degree completion.",
      showAdvisor: true,
    }
  }

  if (lower.includes("advisor") || lower.includes("adviser")) {
    return {
      text: "Talking to an academic advisor is one of the most important steps in the transfer process. They can review your specific situation, confirm how your credits will count, and help you plan which classes to take next. The Advisors page has contact info for transfer advisors at Virginia institutions.",
      showAdvisor: true,
    }
  }

  const needsAdvisor = ADVISOR_KEYWORDS.some((kw) => lower.includes(kw))
  return {
    text: needsAdvisor
      ? "That sounds like a situation that deserves a personalized answer. Transfer situations can vary a lot from student to student — I'd recommend speaking with an academic advisor who can review your specific transcript and goals."
      : "I don't have a specific answer for that yet. For detailed or case-specific questions, an academic advisor can give you the most accurate guidance. Use the Planner to get started, and remember: transfer equivalency is for reference only — final decisions are made by your target school.",
    showAdvisor: true,
  }
}

export function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm Transfer Buddy. I can help you understand which Brightpoint or NOVA classes transfer to Virginia State University and what the results mean. What would you like to know?",
      showAdvisor: false,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const { text, showAdvisor } = getAIResponse(userMsg.text)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text,
        showAdvisor,
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 900)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedQuestions = [
    "What does CSC 201 transfer as?",
    "What is expanded credit?",
    "What does VSU stand for?",
  ]

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, var(--brand) 0%, oklch(0.62 0.14 210) 100%)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Transfer Buddy</p>
                <p className="text-xs text-white/80">AI Transfer Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[380px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === "user" ? "bg-secondary" : ""
                    }`}
                    style={msg.role === "assistant" ? { backgroundColor: "var(--brand)" } : {}}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.showAdvisor && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs h-7 gap-1.5"
                        style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                        onClick={() => {
                          setOpen(false)
                          navigate("/advisors")
                        }}
                      >
                        <UserCheck className="h-3 w-3" />
                        Contact an Advisor
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q)
                    setTimeout(() => {
                      const userMsg: Message = { id: Date.now().toString(), role: "user", text: q }
                      setMessages((prev) => [...prev, userMsg])
                      setInput("")
                      setIsTyping(true)
                      setTimeout(() => {
                        const { text, showAdvisor } = getAIResponse(q)
                        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text, showAdvisor }])
                        setIsTyping(false)
                      }, 900)
                    }, 0)
                  }}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Transfer Buddy..."
                className="text-sm"
                disabled={isTyping}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                style={{ backgroundColor: "var(--brand)" }}
                className="text-white flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        style={{ backgroundColor: "var(--brand)" }}
        aria-label="Open Transfer Buddy chat"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        {!open && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            style={{ backgroundColor: "oklch(0.577 0.245 27.325)" }}
          >
            AI
          </Badge>
        )}
      </button>
    </>
  )
}
