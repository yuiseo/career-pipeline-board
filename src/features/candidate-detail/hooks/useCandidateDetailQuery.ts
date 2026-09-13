import { useQuery } from "@tanstack/react-query"

import { fetchCandidate } from "@/api/candidates"
import { candidateKeys } from "@/api/queryKeys"

export function useCandidateDetailQuery(id: string | null) {
  return useQuery({
    queryKey: candidateKeys.detail(id ?? ""),
    queryFn: () => fetchCandidate(id!),
    enabled: Boolean(id),
  })
}
