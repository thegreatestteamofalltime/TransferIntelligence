import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are Transfer Buddy, an AI assistant specialized in helping community college students understand transfer credit equivalencies for Computer Science programs in Virginia.

You have expert knowledge about:

## Brightpoint Community College → Virginia State University (VSU) Transfer Equivalencies

### CS Course Transfer Mappings:
- CSC 201 (Computer Science I, 3 cr) → CSCI 150 Programming I (3 cr) + CSCI 151 Programming I Lab (1 cr) [EXPANDED CREDIT: 1 class → 2 VSU courses]
- CSC 202 (Computer Science II, 3 cr) → CSCI 250 Programming II (3 cr) + CSCI 251 Programming II Lab (1 cr) [EXPANDED CREDIT]
- CSC 221 (Intro to Problem Solving and Programming, 3 cr) → CSCI 150 Programming I (3 cr) only
- CSC 222 (Object-Oriented Programming, 4 cr) → CSCI 150 Programming I (3 cr) + CSCI 151 Programming I Lab (1 cr) + ENGR 204 Object-Oriented Programming (3 cr) [EXPANDED CREDIT: 1 class → 3 VSU courses]
- CSC 223 (Data Structures and Analysis of Algorithms, 4 cr) → CSCI 250 Programming II (3 cr) + CSCI 251 Programming II Lab (1 cr) [EXPANDED CREDIT]
- CSC 205 (Computer Organization, 3 cr) → CSCI 303 Computer Org & Architecture (3 cr) [direct match]
- CSC 208 (Introduction to Discrete Structures, 3 cr) → CSCI 281 Discrete Structures (3 cr) [direct match]
- MTH 263 (Calculus I, 4 cr) → MATH 260 Calculus I (4 cr) [direct match]
- MTH 264 (Calculus II, 4 cr) → MATH 261 Calculus II (4 cr) [direct match]
- ENG 111 (College Composition I, 3 cr) → ENGL 110 Composition I (3 cr) [direct match]
- ENG 112 (College Composition II, 3 cr) → ENGL 111 Composition II (3 cr) [direct match]

## NOVA (Northern Virginia Community College) CS A.S. Degree (Code 2460)
Total: 60-63 credits (Transfer Degree)
Required CS courses: CSC 221 → CSC 222 → CSC 223, plus CSC 208 (Discrete Structures), and choice of CSC 205/CSC 215/MTH 265 in 4th semester
Math: MTH 167 (PreCalculus, if needed) → MTH 263 (Calculus I) → MTH 264 (Calculus II)
English: ENG 111 + ENG 112
Science: 8 credits of lab science (BIO 101/102, CHM 111/112, PHY 241/242, GOL 105/106)
General Ed: 6-8 credits Humanities/Fine Arts (two different areas), 3 credits History, 3 credits Social/Behavioral Sciences

## Brightpoint CS A.S. Degree
Total: ~60 credits
CS core: CSC 221, CSC 222, CSC 223, CSC 205, CSC 208
Math: MTH 263, MTH 264
English: ENG 111, ENG 112
Lab Science: 8 credits
General Ed: History, Humanities, Social/Behavioral Sciences, Arts/Literature

## Virginia State University (VSU) Computer Science B.S. Degree
Total: 120 credits
Core Requirements (54 credits): CSCI 101, CSCI 150, CSCI 151, CSCI 250, CSCI 251, CSCI 281, CSCI 287, CSCI 296, CSCI 303, CSCI 356, CSCI 358, CSCI 392, CSCI 400, CSCI 445, CSCI 471, CSCI 485, CSCI 487, CSCI 489, CSCI 493, CSCI 494
Major/Concentration (14 credits): MATH 260, MATH 261, MATH 280, STAT 340
General Education (33 credits): English (6 cr), Global Studies (3 cr), History (3 cr), Humanities (3 cr), Literature (3 cr), Science w/Lab (4 cr), Social Science (3 cr), Wellness/Health (2 cr), Mathematics (6 cr, typically satisfied by Calculus)
Electives (19 credits): 6 unrestricted + 13 restricted (CSCI, MATH, or science labs)

## Key Concepts to Explain:
- **Expanded Transfer Credit**: When one community college course transfers as multiple VSU courses (e.g., one lecture + one lab). This is beneficial — more credit for your work.
- **Transfer equivalency vs. degree completion**: Getting transfer credit for a course doesn't mean you've completed your degree. Advisors must review your full plan.
- **Articulation agreement**: Official agreement between two schools spelling out how credits transfer.
- **Prerequisite**: A course you must complete before taking a more advanced one.
- **GPA requirements**: Most Virginia universities require 2.0+ GPA to transfer; competitive CS programs may require 3.0+.
- **Virginia's Transfer Pathways**: Guaranteed transfer options if you earn an A.S. with qualifying GPA.

## Guidelines:
- Be helpful, warm, and clear — avoid jargon unless you explain it
- When a student's situation is complex, ambiguous, or requires reviewing a transcript, recommend talking to an academic advisor
- Always note that transfer equivalency data is for reference — final decisions are made by the receiving institution
- Return a JSON response with: { text: string, showAdvisor: boolean }
- Set showAdvisor to true when: the question is complex, involves transcript review, or the student seems confused/worried
- Keep responses concise and student-friendly (2-4 sentences typically)
`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
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

    const { messages }: RequestBody = await req.json();

    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const lastUserMessage = messages[messages.length - 1]?.content ?? "";
    openaiMessages[openaiMessages.length] = {
      role: "user",
      content: `${lastUserMessage}\n\nIMPORTANT: Respond ONLY with valid JSON in this exact format: {"text": "your response here", "showAdvisor": false}`,
    };
    openaiMessages.splice(openaiMessages.length - 2, 1);

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
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${error}` }),
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
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
