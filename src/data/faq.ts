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
    answer:
      "The best way to find out is to check the articulation agreement between your current school and your target school. TransferIntelligence shows you course-by-course mappings based on these agreements. You can also use our Planner tool to enter your courses and see which ones transfer. Always confirm the results with an academic advisor before making enrollment decisions.",
    category: "Transfer Basics",
  },
  {
    id: "2",
    question: "What is an articulation agreement and why does it matter?",
    answer:
      "An articulation agreement is a formal contract between two colleges that specifies exactly how credits earned at one school transfer to another. It matters because it protects you: if a course is listed in the agreement, the receiving school is obligated to accept it. Without an articulation agreement, a school may reject or limit the credits you've earned. Always check whether an agreement exists before choosing courses.",
    category: "Transfer Basics",
  },
  {
    id: "3",
    question: "What happens if my course doesn't have a direct equivalent?",
    answer:
      "If your course doesn't transfer directly, there are a few options: (1) It may still count as a free elective toward your degree. (2) You may be able to take a substitute course that better aligns with the target school's requirements. (3) You can petition an academic department for a course substitution based on your syllabus and transcripts. TransferIntelligence will suggest alternative pathways when no direct equivalent exists. Contacting an advisor is strongly recommended in these cases.",
    category: "Course Transfer",
  },
  {
    id: "4",
    question: "Can I transfer if I have a low GPA?",
    answer:
      "It depends on the institution and program. Most Virginia public universities require a minimum 2.0 GPA for general transfer admission, but competitive programs like Computer Science often require 3.0 or higher. Community college students with a completed Associate's degree who meet GPA requirements may be guaranteed admission to some Virginia universities under the VCCS Transfer Pathways program. An academic advisor can help you understand your options.",
    category: "Admissions",
  },
  {
    id: "5",
    question: "How do prerequisite requirements work when transferring?",
    answer:
      "Prerequisites are required courses you must complete before enrolling in more advanced classes. When you transfer, your academic advisor at the new school will review your transcript to confirm you've met prerequisite requirements. If you've completed an equivalent course at your community college, it may satisfy the prerequisite. However, if there's no equivalent, you may need to take the prerequisite at the new school before advancing to higher-level courses.",
    category: "Course Transfer",
  },
  {
    id: "6",
    question: "What is the VCCS Transfer Pathways program?",
    answer:
      "The Virginia Community College System (VCCS) Transfer Pathways program is a statewide initiative that guarantees transfer admission to participating Virginia public universities for students who complete an Associate of Arts and Sciences (AAS) or Associate of Science (AS) degree with a qualifying GPA and curriculum requirements. It's one of the most direct and reliable ways to transfer in Virginia. Ask your advisor whether your current degree plan qualifies.",
    category: "Virginia-Specific",
  },
  {
    id: "7",
    question: "Will all my college credits expire?",
    answer:
      "Most academic credits do not technically 'expire,' but older credits — especially in fields like science, technology, and math — may not be accepted if they are more than 5–10 years old. Receiving schools review credit age at their discretion. Time-sensitive fields like nursing, chemistry, and computer science may require you to retake outdated coursework. Always check with your target school's admissions office about credit age policies.",
    category: "Admissions",
  },
]
