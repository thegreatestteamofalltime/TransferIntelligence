import { useState, useRef, useEffect } from "react"
import { X, Send, User, UserCheck } from "lucide-react"
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

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function getAIResponse(history: ChatMessage[]): Promise<{ text: string; showAdvisor: boolean }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/transfer-chat`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: history }),
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()
    return {
      text: data.text ?? "I'm not sure how to answer that. Try rephrasing, or speak with an academic advisor.",
      showAdvisor: data.showAdvisor ?? false,
    }
  } catch {
    return {
      text: "I'm having trouble connecting right now. Please try again in a moment, or contact an academic advisor for assistance.",
      showAdvisor: true,
    }
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
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

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

    const { text: responseText, showAdvisor } = await getAIResponse(newHistory)

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: responseText,
      showAdvisor,
    }

    setMessages((prev) => [...prev, aiMsg])
    setChatHistory((prev) => [...prev, { role: "assistant", content: responseText }])
    setIsTyping(false)
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
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="/transferbuddyhead.png" alt="Transfer Buddy" className="w-9 h-9 object-contain" />
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
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${
                      msg.role === "user" ? "bg-secondary" : "bg-white border border-border"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <img src="/transferbuddyhead.png" alt="Transfer Buddy" className="w-7 h-7 object-contain" />
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

          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
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
