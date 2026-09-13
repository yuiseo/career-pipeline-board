import { API_PATHS } from "@/api/endpoints"
import { get, patch } from "@/api/client"
import {
  candidateDetailSchema,
  candidateSummarySchema,
  updateStageRequestSchema,
  type CandidateDetail,
  type CandidateSummary,
  type Stage,
} from "@/types/candidate"
import { z } from "zod"

const candidatesListSchema = z.array(candidateSummarySchema)

export function fetchCandidates(): Promise<CandidateSummary[]> {
  return get(API_PATHS.candidates, candidatesListSchema)
}

export function fetchCandidate(id: string): Promise<CandidateDetail> {
  return get(API_PATHS.candidate(id), candidateDetailSchema)
}

export function updateCandidateStage(
  id: string,
  stage: Stage
): Promise<CandidateDetail> {
  const body = updateStageRequestSchema.parse({ stage })
  return patch(API_PATHS.candidateStage(id), candidateDetailSchema, body)
}
