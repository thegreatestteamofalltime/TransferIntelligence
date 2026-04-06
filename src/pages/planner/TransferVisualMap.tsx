import { ArrowRight, GraduationCap, School } from "lucide-react"

interface TransferVisualMapProps {
  currentSchool: string
  targetSchool: string
  currentProgram: string
  targetProgram: string
}

function SchoolNode({ name, program, icon, accent }: { name: string; program: string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 text-center min-w-0 flex-1 max-w-[160px] ${accent ? "border-[var(--brand)] bg-[var(--brand-muted)]" : "border-border bg-muted/40"}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${accent ? "bg-[var(--brand)] text-white" : "bg-muted text-foreground"}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-foreground leading-tight">{name}</p>
        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{program}</p>
      </div>
    </div>
  )
}

export function TransferVisualMap({
  currentSchool,
  targetSchool,
  currentProgram,
  targetProgram,
}: TransferVisualMapProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <SchoolNode
        name={currentSchool}
        program={currentProgram}
        icon={<GraduationCap className="h-4 w-4" />}
      />
      <div className="flex flex-col items-center flex-1 min-w-0 px-1">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-border" />
          <div className="mx-1.5 flex items-center justify-center rounded-full w-7 h-7 border-2 border-[var(--brand)] bg-[var(--brand-muted)]">
            <ArrowRight className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap font-medium">Transfer Path</span>
      </div>
      <SchoolNode
        name={targetSchool}
        program={targetProgram}
        icon={<School className="h-4 w-4" />}
        accent
      />
    </div>
  )
}
