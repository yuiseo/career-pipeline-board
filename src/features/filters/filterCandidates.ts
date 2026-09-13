import type { CandidateSummary, Position } from "@/types/candidate"

export type CandidateFilterCriteria = {
  nameQuery: string
  positions: ReadonlyArray<Position>
}

/**
 * 이름(trim 후 부분 일치) AND 직무(OR).
 * 빈 이름 쿼리 = 이름 제약 없음, 빈 positions = 전체 직무.
 */
export function filterCandidates(
  candidates: ReadonlyArray<CandidateSummary>,
  { nameQuery, positions }: CandidateFilterCriteria
): CandidateSummary[] {
  const trimmedName = nameQuery.trim()
  const hasNameConstraint = trimmedName.length > 0
  const hasPositionConstraint = positions.length > 0

  return candidates.filter((candidate) => {
    const matchesName =
      !hasNameConstraint || candidate.name.includes(trimmedName)
    const matchesPosition =
      !hasPositionConstraint || positions.includes(candidate.position)
    return matchesName && matchesPosition
  })
}
