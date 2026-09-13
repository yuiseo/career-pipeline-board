import { z } from "zod"

export const STAGES = [
  "document",
  "interview",
  "offer",
  "hired",
  "rejected",
] as const

export const stageSchema = z.enum(STAGES)
export type Stage = z.infer<typeof stageSchema>

export const STAGE_LABEL: Record<Stage, string> = {
  document: "서류검토",
  interview: "면접",
  offer: "처우협의",
  hired: "최종합격",
  rejected: "불합격",
}

export const POSITIONS = [
  "frontend",
  "backend",
  "mobile",
  "design",
  "pm",
  "data",
] as const

export const positionSchema = z.enum(POSITIONS)
export type Position = z.infer<typeof positionSchema>

export const POSITION_LABEL: Record<Position, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  mobile: "모바일",
  design: "디자인",
  pm: "PM",
  data: "데이터",
}

/** 보드·카드용 목록 데이터 (GET /api/candidates) */
export const candidateSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  position: positionSchema,
  /** 지원일 (YYYY-MM-DD) */
  appliedAt: z.iso.date(),
  stage: stageSchema,
})
export type CandidateSummary = z.infer<typeof candidateSummarySchema>

/** 상세 패널용 데이터 (GET /api/candidates/:id) */
export const candidateDetailSchema = candidateSummarySchema.extend({
  email: z.email(),
  phone: z.string(),
  experienceYears: z.number().int().nonnegative(),
  education: z.string(),
})
export type CandidateDetail = z.infer<typeof candidateDetailSchema>
