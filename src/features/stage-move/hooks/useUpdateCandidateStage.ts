import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateCandidateStage } from "@/api/candidates"
import { candidateKeys } from "@/api/queryKeys"
import type {
  CandidateDetail,
  CandidateSummary,
  Stage,
} from "@/types/candidate"

type UpdateCandidateStageVariables = {
  id: string
  stage: Stage
}

function toSummary(detail: CandidateDetail): CandidateSummary {
  return {
    id: detail.id,
    name: detail.name,
    position: detail.position,
    appliedAt: detail.appliedAt,
    stage: detail.stage,
  }
}

export function useUpdateCandidateStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, stage }: UpdateCandidateStageVariables) =>
      updateCandidateStage(id, stage),
    onSuccess: (detail) => {
      queryClient.setQueryData<CandidateSummary[]>(
        candidateKeys.lists(),
        (previous) => {
          if (previous == null) return previous

          const summary = toSummary(detail)
          return previous.map((candidate) =>
            candidate.id === detail.id ? summary : candidate
          )
        }
      )

      queryClient.setQueryData<CandidateDetail>(
        candidateKeys.detail(detail.id),
        detail
      )
    },
  })
}
