export const STAGES = [
  "document",
  "interview",
  "offer",
  "hired",
  "rejected",
] as const

export type Stage = (typeof STAGES)[number]

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

export type Position = (typeof POSITIONS)[number]

export const POSITION_LABEL: Record<Position, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  mobile: "모바일",
  design: "디자인",
  pm: "PM",
  data: "데이터",
}

/** 보드·카드용 목록 데이터 (GET /api/candidates) */
export type CandidateSummary = {
  id: string
  name: string
  position: Position
  /** 지원일 (YYYY-MM-DD) */
  appliedAt: string
  stage: Stage
}

/** 상세 패널용 데이터 (GET /api/candidates/:id) */
export type CandidateDetail = CandidateSummary & {
  email: string
  phone: string
  experienceYears: number
  education: string
}
