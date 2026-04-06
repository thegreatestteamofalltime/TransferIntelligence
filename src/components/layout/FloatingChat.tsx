import { useState, useRef, useEffect } from "react"
import { X, Send, GraduationCap, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: "user" | "assistant"
  text: string
  showAdvisor?: boolean
  advisorFilter?: { college?: string; universities?: string[] }
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface UserContext {
  currentCollege?: string
  targetUniversities?: string[]
  major?: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function getAIResponse(
  history: ChatMessage[],
  userContext: UserContext
): Promise<{ text: string; showAdvisor: boolean; isCannotHelp: boolean; endOfConversation: boolean }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/transfer-chat`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: history, userContext }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    return {
      text: data.text ?? "I'm not sure how to answer that. Try rephrasing, or speak with an academic advisor.",
      showAdvisor: data.showAdvisor ?? false,
      isCannotHelp: data.isCannotHelp ?? false,
      endOfConversation: data.endOfConversation ?? false,
    }
  } catch {
    return {
      text: "I'm having trouble connecting right now. Please try again in a moment, or contact an academic advisor for assistance.",
      showAdvisor: true,
      isCannotHelp: false,
      endOfConversation: false,
    }
  }
}

const INSTITUTIONAL_KEYWORDS = [
  "apply for graduation",
  "applying for graduation",
  "graduation application",
  "apply to transfer",
  "applying to transfer",
  "transfer application",
  "apply for admission",
  "applying for admission",
  "enrollment application",
  "register for graduation",
]

function isInstitutionalQuery(text: string): boolean {
  const lower = text.toLowerCase()
  return INSTITUTIONAL_KEYWORDS.some((kw) => lower.includes(kw))
}

const suggestedQuestions = [
  "How does transfer credit work?",
  "What is an articulation agreement?",
  "How do I know if my credits will transfer?",
]

export function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I'm TransferBuddy! Ask me anything about transferring your credits to a Virginia four-year university.",
      showAdvisor: false,
    },
  ])
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userContext] = useState<UserContext>({})
  const [cannotHelpStreak, setCannotHelpStreak] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isWelcomeState = messages.length === 1

  useEffect(() => {
    if (open && !isWelcomeState) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open, isWelcomeState])

  const addAdvisorEscalation = (filter?: { college?: string; universities?: string[] }) => {
    const aiMsg: Message = {
      id: (Date.now() + 2).toString(),
      role: "assistant",
      text: "It looks like I'm having trouble helping with this. For the best guidance on your specific situation, please reach out to an academic advisor directly.",
      showAdvisor: true,
      advisorFilter: filter,
    }
    setMessages((prev) => [...prev, aiMsg])
    setChatHistory((prev) => [...prev, { role: "assistant", content: aiMsg.text }])
    setCannotHelpStreak(0)
  }

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim()
    if (!messageText) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: messageText,
    }

    const newHistory: ChatMessage[] = [...chatHistory, { role: "user", content: messageText }]

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    setChatHistory(newHistory)

    if (isInstitutionalQuery(messageText)) {
      setIsTyping(false)
      addAdvisorEscalation(userContext.currentCollege || userContext.targetUniversities
        ? { college: userContext.currentCollege, universities: userContext.targetUniversities }
        : undefined)
      return
    }

    const { text: responseText, showAdvisor, isCannotHelp, endOfConversation } = await getAIResponse(newHistory, userContext)

    const newStreak = isCannotHelp ? cannotHelpStreak + 1 : 0
    setCannotHelpStreak(newStreak)

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: responseText,
      showAdvisor,
    }

    setMessages((prev) => [...prev, aiMsg])
    setChatHistory((prev) => [...prev, { role: "assistant", content: responseText }])
    setIsTyping(false)

    if (newStreak >= 5) {
      setTimeout(() => {
        addAdvisorEscalation(userContext.currentCollege || userContext.targetUniversities
          ? { college: userContext.currentCollege, universities: userContext.targetUniversities }
          : undefined)
      }, 100)
    } else if (endOfConversation) {
      const reminderMsg: Message = {
        id: (Date.now() + 3).toString(),
        role: "assistant",
        text: "Remember: always verify your transfer plan with an official academic advisor to make sure everything is accurate and ready to go.",
        showAdvisor: true,
        advisorFilter: userContext.currentCollege || userContext.targetUniversities
          ? { college: userContext.currentCollege, universities: userContext.targetUniversities }
          : undefined,
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, reminderMsg])
        setChatHistory((prev) => [...prev, { role: "assistant", content: reminderMsg.text }])
      }, 600)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleAdvisorNav = (filter?: { college?: string; universities?: string[] }) => {
    setOpen(false)
    const params: string[] = []
    if (filter?.college) params.push(`college=${encodeURIComponent(filter.college)}`)
    if (filter?.universities?.length) params.push(`universities=${encodeURIComponent(filter.universities.join(","))}`)
    const hash = params.length ? `/advisors?${params.join("&")}` : "/advisors"
    window.location.hash = hash
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const ChatHeader = () => (
    <div
      className="relative flex items-center justify-center px-4 py-3 text-white"
      style={{ background: "linear-gradient(135deg, var(--brand) 0%, oklch(0.62 0.14 210) 100%)" }}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-base font-extrabold tracking-tight text-white">TransferBuddy</h2>
        <p className="text-xs text-white/80">Transfer AI Assistant</p>
      </div>
      <button
        onClick={() => setOpen(false)}
        className="absolute right-4 text-white/80 hover:text-white transition-colors"
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">

          {isWelcomeState ? (
            <>
              <ChatHeader />

              <div className="flex flex-col items-center px-5 pb-4 pt-2">
                <img
                  src="/transferbuddybody.png"
                  alt="Transfer Buddy"
                  className="w-44 h-44 object-contain"
                />
                <p className="text-sm text-muted-foreground text-center mt-3 leading-relaxed">
                  Hi, I'm TransferBuddy! Ask me anything about transferring your credits to a Virginia four-year university.
                </p>
              </div>

              <div className="px-5 pb-4 flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50"
                    style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "color-mix(in oklch, var(--brand) 10%, transparent)"
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = ""
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4 border-t border-border pt-3 bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Transfer Buddy..."
                    className="text-sm"
                    disabled={isTyping}
                    autoFocus
                  />
                  <Button
                    size="icon"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isTyping}
                    className="text-white flex-shrink-0"
                    style={{ backgroundColor: "var(--brand)" }}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <ChatHeader />

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[380px]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${
                          msg.role === "user" ? "text-white" : "bg-white border border-border"
                        }`}
                        style={msg.role === "user" ? { backgroundColor: "var(--brand)" } : {}}
                      >
                        {msg.role === "user" ? (
                          <GraduationCap className="h-4 w-4" />
                        ) : (
                          <img src="/transferbuddyhead.png" alt="Transfer Buddy" className="w-7 h-7 object-contain" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "text-white rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm"
                          }`}
                          style={msg.role === "user" ? { backgroundColor: "var(--brand)" } : {}}
                        >
                          {msg.text}
                        </div>
                        {(msg.showAdvisor) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs h-7 gap-1.5"
                            style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                            onClick={() => handleAdvisorNav(msg.advisorFilter)}
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
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white border border-border">
                        <img src="/transferbuddyhead.png" alt="Transfer Buddy" className="w-7 h-7 object-contain" />
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
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isTyping}
                    style={{ background: "var(--brand-gradient)" }}
                    className="text-white flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-white"
        style={{ border: "2px solid var(--brand)" }}
        aria-label="Open Transfer Buddy chat"
      >
        {open ? (
          <X className="h-6 w-6" style={{ color: "var(--brand)" }} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" aria-hidden="true">
            <path d="M12 3C7.029 3 3 6.582 3 11c0 2.137.91 4.07 2.388 5.527L4.5 20.5l4.39-1.611A9.7 9.7 0 0 0 12 19c4.971 0 9-3.582 9-8s-4.029-8-9-8Z" fill="var(--brand)" />
            <circle cx="8.5" cy="11" r="1.2" fill="white" />
            <circle cx="12" cy="11" r="1.2" fill="white" />
            <circle cx="15.5" cy="11" r="1.2" fill="white" />
          </svg>
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
