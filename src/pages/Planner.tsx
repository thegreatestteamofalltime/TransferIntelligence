import { useState } from "react"
import { transferAgreements } from "@/data/courses"
import { degreePlans } from "@/data/degrees"
import { type CatalogCourse } from "@/data/courseCatalog"
import { PlannerStep1 } from "./planner/PlannerStep1"
import { PlannerStep2 } from "./planner/PlannerStep2"
import { PlannerResults } from "./planner/PlannerResults"

type Step = "step1" | "step2" | "results"

export function PlannerPage() {
  const [step, setStep] = useState<Step>("step1")
  const [currentSchool, setCurrentSchool] = useState("Brightpoint Community College")
  const [currentDegreeId, setCurrentDegreeId] = useState("brightpoint-cs-as")
  const [targetSchool, setTargetSchool] = useState("Virginia State University")
  const [program, setProgram] = useState("Computer Science")
  const [completedCourses, setCompletedCourses] = useState<CatalogCourse[]>([])

  const currentDegree = degreePlans.find((d) => d.id === currentDegreeId) ?? degreePlans[0]
  const targetDegree = degreePlans.find(
    (d) => d.school === targetSchool && d.program === program && d.degree.startsWith("Bachelor")
  ) ?? degreePlans.find((d) => d.school === targetSchool) ?? degreePlans[2]

  const agreement =
    transferAgreements.find(
      (a) =>
        a.sourceSchool === currentSchool &&
        a.targetSchool === targetSchool &&
        a.program === program
    ) ?? transferAgreements[0]

  const handleEdit = () => setStep("step1")

  if (step === "results") {
    return (
      <PlannerResults
        currentSchool={currentSchool}
        currentDegree={currentDegree}
        targetSchool={targetSchool}
        targetDegree={targetDegree}
        program={program}
        completedCourses={completedCourses}
        agreement={agreement}
        onEdit={handleEdit}
      />
    )
  }

  if (step === "step2") {
    return (
      <PlannerStep2
        currentSchool={currentSchool}
        completedCourses={completedCourses}
        setCompletedCourses={setCompletedCourses}
        onNext={() => setStep("results")}
        onBack={() => setStep("step1")}
      />
    )
  }

  return (
    <PlannerStep1
      currentSchool={currentSchool}
      setCurrentSchool={setCurrentSchool}
      currentDegreeId={currentDegreeId}
      setCurrentDegreeId={setCurrentDegreeId}
      targetSchool={targetSchool}
      setTargetSchool={setTargetSchool}
      program={program}
      setProgram={setProgram}
      onNext={() => setStep("step2")}
    />
  )
}
