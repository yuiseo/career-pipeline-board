import { STAGES, type CandidateSummary, type Stage } from "@/types/candidate"

export function groupCandidatesByStage(
  candidates: CandidateSummary[]
): Record<Stage, CandidateSummary[]> {
  const grouped = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = []
      return acc
    },
    {} as Record<Stage, CandidateSummary[]>
  )

  for (const candidate of candidates) {
    grouped[candidate.stage].push(candidate)
  }

  return grouped
}
