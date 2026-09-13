import { useQuery } from "@tanstack/react-query"

import { fetchCandidates } from "@/api/candidates"
import { candidateKeys } from "@/api/queryKeys"

export function useCandidatesQuery() {
  return useQuery({
    queryKey: candidateKeys.lists(),
    queryFn: fetchCandidates,
  })
}
