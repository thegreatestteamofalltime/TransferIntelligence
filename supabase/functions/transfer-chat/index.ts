import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are Transfer Buddy, an AI assistant helping community college students in Virginia understand transfer credit equivalencies and transfer planning.

## Your Knowledge Base

### Brightpoint Community College → Virginia State University (VSU) Transfer Equivalencies
- CSC 201 (Computer Science I, 3 cr) → CSCI 150 Programming I (3 cr) + CSCI 151 Programming I Lab (1 cr) [EXPANDED CREDIT]
- CSC 202 (Computer Science II, 3 cr) → CSCI 250 Programming II (3 cr) + CSCI 251 Programming II Lab (1 cr) [EXPANDED CREDIT]
- CSC 221 (Intro to Problem Solving, 3 cr) → CSCI 150 Programming I (3 cr)
- CSC 222 (Object-Oriented Programming, 4 cr) → CSCI 150 (3 cr) + CSCI 151 (1 cr) + ENGR 204 (3 cr) [EXPANDED CREDIT]
- CSC 223 (Data Structures, 4 cr) → CSCI 250 (3 cr) + CSCI 251 (1 cr) [EXPANDED CREDIT]
- CSC 205 (Computer Organization, 3 cr) → CSCI 303 Computer Org & Architecture (3 cr)
- CSC 208 (Discrete Structures, 3 cr) → CSCI 281 Discrete Structures (3 cr)
- MTH 263 (Calculus I, 4 cr) → MATH 260 Calculus I (4 cr)
- MTH 264 (Calculus II, 4 cr) → MATH 261 Calculus II (4 cr)
- ENG 111 (Composition I, 3 cr) → ENGL 110 Composition I (3 cr)
- ENG 112 (Composition II, 3 cr) → ENGL 111 Composition II (3 cr)

### NOVA CS A.S. Degree (Code 2460) — 60-63 credits
CS: CSC 221 → CSC 222 → CSC 223, plus CSC 208, and choice of CSC 205/215/MTH 265
Math: MTH 263 → MTH 264; English: ENG 111 + ENG 112; Science: 8 credits lab science; Gen Ed: Humanities, History, Social Sciences

### Brightpoint CS A.S. Degree — ~60 credits
CS core: CSC 221, 222, 223, 205, 208; Math: MTH 263, 264; English: ENG 111, 112; Lab Science: 8 credits; Gen Ed

### VSU Computer Science B.S. Degree — 120 credits
Core (54 cr): CSCI 101, 150, 151, 250, 251, 281, 287, 296, 303, 356, 358, 392, 400, 445, 471, 485, 487, 489, 493, 494
Math: MATH 260, 261, 280, STAT 340 (14 cr); Gen Ed (33 cr); Electives (19 cr)

### VCCS–VSU Guaranteed Admission Agreement (GAA) — Last Updated March 28, 2023
Covers ALL VCCS colleges → VSU. Eligible: AA, AS, AA&S degrees. Requires: 2.0+ GPA, C or better in each course, 30+ credits at VCCS, max 90 transferable credits. Application deadlines: Fall June 1, Spring December 1. Completing a transfer degree satisfies all lower-division gen ed at VSU. Guaranteed admission to VSU generally — NOT to a specific program.

## Context Gathering
When the user mentions a specific college, university, or major — or asks about their specific transfer situation — you MUST gather missing context by asking these questions one at a time (not all at once):
1. Which community college are you currently attending?
2. Which four-year university (or universities) are you hoping to transfer to?
3. What major or program are you pursuing?

Only ask for context that is actually missing and relevant to the user's question. Do not ask about schools if the user's question is purely conceptual (e.g., "what is expanded credit?").

## Key Concepts
- **Expanded Transfer Credit**: One community college course → multiple university courses (beneficial — more credit for the work)
- **Articulation agreement / GAA**: Official agreement spelling out how credits transfer and guaranteeing admission
- **Prerequisite**: A course required before taking a more advanced one
- **GPA requirements**: GAA minimum is 2.0; competitive programs may require higher

## Guidelines
- Be warm, helpful, and clear — avoid jargon or explain it when you use it
- Do NOT assume the student attends Brightpoint, NOVA, or is transferring to VSU unless they say so
- When citing GAA details, always note they are based on the agreement last updated March 2023
- When a question involves a transcript review, official decisions, or institutional-specific processes (applying to graduate, applying for transfer admission, enrollment steps), set showAdvisor to true
- Always note transfer equivalency data is for reference — final decisions are made by the receiving institution
- Keep responses concise and student-friendly (2-4 sentences typically)
- At the end of a helpful conversation (when the user seems satisfied and done), set endOfConversation to true to remind them to verify with an advisor

## Response Format
Return ONLY valid JSON: { "text": string, "showAdvisor": boolean, "isCannotHelp": boolean, "endOfConversation": boolean }
- isCannotHelp: true when you cannot address the question and respond with something like "Let me know if I can help with something else" or similar deflection
- endOfConversation: true when the conversation appears to be wrapping up satisfactorily
- showAdvisor: true when the situation is complex, requires a transcript, or involves institutional-specific processes
`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UserContext {
  currentCollege?: string;
  targetUniversities?: string[];
  major?: string;
}

interface RequestBody {
  messages: Message[];
  userContext?: UserContext;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, userContext }: RequestBody = await req.json();

    const contextSummary = userContext && (userContext.currentCollege || userContext.targetUniversities?.length || userContext.major)
      ? `\n\n[Student context: ${[
          userContext.currentCollege ? `currently at ${userContext.currentCollege}` : null,
          userContext.targetUniversities?.length ? `targeting ${userContext.targetUniversities.join(", ")}` : null,
          userContext.major ? `studying ${userContext.major}` : null,
        ].filter(Boolean).join(", ")}]`
      : "";

    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m, i) => ({
        role: m.role,
        content: i === messages.length - 1 && m.role === "user"
          ? `${m.content}${contextSummary}\n\nIMPORTANT: Respond ONLY with valid JSON: {"text": "...", "showAdvisor": false, "isCannotHelp": false, "endOfConversation": false}`
          : m.content,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openaiMessages,
        temperature: 0.4,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", response.status, error);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status} ${error}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        text: "I'm having trouble connecting right now. Please try again in a moment, or contact an academic advisor for assistance.",
        showAdvisor: true,
        isCannotHelp: false,
        endOfConversation: false,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
