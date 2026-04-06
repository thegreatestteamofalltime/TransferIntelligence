import { CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, Layers, ArrowRight, GraduationCap, School } from "lucide-react"
import type { TransferResult, DegreeGapResult, TargetDegreeGap } from "./plannerUtils"

interface TransferVisualMapProps {
  currentSchool: string
  targetSchool: string
  currentProgram: string
  targetProgram: string
  degreeGap: DegreeGapResult
  transferResult: TransferResult
  targetGap: TargetDegreeGap
}

interface StatPillProps {
  count: number
  label: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
}

function StatPill({ count, label, color, bg, border, icon }: StatPillProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border px-3 py-3 gap-1 min-w-0 flex-1 ${bg} ${border}`}>
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-2xl font-extrabold tabular-nums leading-none">{count}</span>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground leading-tight text-center">{label}</span>
    </div>
  )
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
  degreeGap,
  transferResult,
  targetGap,
}: TransferVisualMapProps) {
  const directCount = transferResult.transferring.length
  const expandedCount = transferResult.expanded.length
  const reviewCount = transferResult.conditional.length
  const noEquivCount = transferResult.noEquiv.length
  const totalTransferring = directCount + expandedCount
  return (
    <div className="mb-6 rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Transfer Overview</p>
      </div>

      <div className="px-4 pt-4 pb-5 space-y-5">
        {/* School flow */}
        <div className="flex items-center gap-2">
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

        {/* Credit flow summary */}
        <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="px-3 py-3 text-center">
              <p className="text-xl font-extrabold text-foreground tabular-nums">{degreeGap.completedCredits}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Credits Earned</p>
            </div>
            <div className="px-3 py-3 text-center">
              <p className="text-xl font-extrabold tabular-nums" style={{ color: "var(--brand)" }}>{transferResult.totalTransferCredits}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Credits Transfer</p>
            </div>
            <div className="px-3 py-3 text-center">
              <p className="text-xl font-extrabold text-warning tabular-nums">{targetGap.totalRemainingCredits}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Still Needed</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-3 pb-3 pt-1 border-t border-border">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
              <span>Transfer progress</span>
              <span className="font-semibold">{totalTransferring} of {degreeGap.completedCredits} cr transferring</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden flex">
              {totalTransferring > 0 && (
                <div
                  className="h-full rounded-l-full transition-all"
                  style={{
                    width: `${Math.round((totalTransferring / degreeGap.completedCredits) * 100)}%`,
                    background: "var(--brand-gradient)",
                  }}
                />
              )}
              {reviewCount > 0 && (
                <div
                  className="h-full bg-warning/70 transition-all"
                  style={{ width: `${Math.round((reviewCount / degreeGap.completedCredits) * 100)}%` }}
                />
              )}
              {noEquivCount > 0 && (
                <div
                  className="h-full bg-destructive/50 rounded-r-full transition-all"
                  style={{ width: `${Math.round((noEquivCount / degreeGap.completedCredits) * 100)}%` }}
                />
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--brand-gradient)" }} />
                Transfers
              </span>
              {reviewCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-warning/70" />
                  Needs Review
                </span>
              )}
              {noEquivCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-destructive/50" />
                  No Equiv.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex gap-2">
          <StatPill
            count={directCount}
            label="Direct Transfer"
            color="text-success"
            bg="bg-success/8"
            border="border-success/25"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          {expandedCount > 0 && (
            <StatPill
              count={expandedCount}
              label="Expanded Credit"
              color="text-blue-600 dark:text-blue-400"
              bg="bg-blue-50 dark:bg-blue-950/30"
              border="border-blue-200 dark:border-blue-800/50"
              icon={<Layers className="h-4 w-4" />}
            />
          )}
          {reviewCount > 0 && (
            <StatPill
              count={reviewCount}
              label="Needs Review"
              color="text-warning"
              bg="bg-warning/8"
              border="border-warning/25"
              icon={<AlertTriangle className="h-4 w-4" />}
            />
          )}
          <StatPill
            count={noEquivCount}
            label="No Equivalent"
            color="text-destructive"
            bg="bg-destructive/8"
            border="border-destructive/25"
            icon={<XCircle className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  )
}
