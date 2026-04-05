export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How do I know which of my courses will transfer?",
    answer: "Check the articulation agreement between your current school and your target school. TransferIntelligence shows you course-by-course mappings based on these agreements. Use our Planner tool to enter your courses and see which ones transfer. Always confirm with an academic advisor before making enrollment decisions.",
    category: "Transfer Basics",
  },
  {
    id: "2",
    question: "What is an articulation agreement and why does it matter?",
    answer: "An articulation agreement is a formal contract between two colleges specifying exactly how credits transfer. It matters because if a course is listed in the agreement, the receiving school is obligated to accept it. Without one, a school may reject or limit your credits. Always check whether an agreement exists before choosing courses.",
    category: "Transfer Basics",
  },
  {
    id: "3",
    question: "What happens if my course doesn't have a direct equivalent?",
    answer: "Your options include: (1) It may count as a free elective. (2) You may take a substitute course. (3) You can petition the academic department using your syllabus and transcripts. TransferIntelligence will suggest alternative pathways. Contacting an advisor is strongly recommended.",
    category: "Course Transfer",
  },
  {
    id: "4",
    question: "Can I transfer if I have a low GPA?",
    answer: "Most Virginia public universities require a minimum 2.0 GPA for general transfer, but competitive programs like Computer Science often require 3.0 or higher. Community college students with a completed Associate's degree who meet GPA requirements may be guaranteed admission under the VCCS Transfer Pathways program. An advisor can help you understand your options.",
    category: "Admissions",
  },
  {
    id: "5",
    question: "How do prerequisite requirements work when transferring?",
    answer: "Prerequisites are required courses before enrolling in advanced classes. When you transfer, your advisor will review your transcript to confirm you've met prerequisite requirements. If you've completed an equivalent course, it may satisfy the prerequisite. Otherwise, you may need to take it at the new school before advancing.",
    category: "Course Transfer",
  },
  {
    id: "6",
    question: "What is the VCCS Transfer Pathways program?",
    answer: "The Virginia Community College System (VCCS) Transfer Pathways program guarantees transfer admission to participating Virginia public universities for students who complete an A.S. or A.A. degree with a qualifying GPA. It's one of the most direct ways to transfer in Virginia. Ask your advisor whether your degree plan qualifies.",
    category: "Virginia-Specific",
  },
  {
    id: "7",
    question: "Will all my college credits expire?",
    answer: "Most credits don't technically expire, but older credits — especially in science, technology, and math — may not be accepted if more than 5–10 years old. Receiving schools review credit age at their discretion. Time-sensitive fields like nursing, chemistry, and computer science may require retaking outdated coursework.",
    category: "Admissions",
  },
]

export const faqsByCategory: Record<string, FAQItem[]> = faqs.reduce<Record<string, FAQItem[]>>(
  (acc, f) => {
    if (!acc[f.category]) acc[f.category] = []
    acc[f.category].push(f)
    return acc
  },
  {}
)
