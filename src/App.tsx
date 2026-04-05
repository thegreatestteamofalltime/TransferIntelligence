import { useState, useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/layout/Layout"
import { getCurrentRoute, type Route } from "@/lib/router"
import { HomePage } from "@/pages/Home"
import { GetStartedPage } from "@/pages/GetStarted"
import { PlannerPage } from "@/pages/Planner"
import { TerminologyPage } from "@/pages/Terminology"
import { CollegesPage } from "@/pages/Colleges"
import { AdvisorsPage } from "@/pages/Advisors"
import { FAQPage } from "@/pages/FAQ"
import { ContactPage } from "@/pages/Contact"
import { AboutPage } from "@/pages/About"
import { ProgramsPage } from "@/pages/Programs"
import { AgreementsPage } from "@/pages/Agreements"

function RouterView({ route }: { route: Route }) {
  switch (route) {
    case "/":
      return <HomePage />
    case "/get-started":
      return <GetStartedPage />
    case "/planner":
      return <PlannerPage />
    case "/terminology":
      return <TerminologyPage />
    case "/colleges":
      return <CollegesPage />
    case "/programs":
      return <ProgramsPage />
    case "/advisors":
      return <AdvisorsPage />
    case "/agreements":
      return <AgreementsPage />
    case "/faq":
      return <FAQPage />
    case "/contact":
      return <ContactPage />
    case "/about":
      return <AboutPage />
    default:
      return <HomePage />
  }
}

export function App() {
  const [route, setRoute] = useState<Route>(getCurrentRoute())

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute())
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <TooltipProvider>
      <Layout currentRoute={route}>
        <RouterView route={route} />
      </Layout>
    </TooltipProvider>
  )
}

export default App
