import { STAGES, type Stage } from "@/types/candidate"

/** 현재 단계를 제외한 이동 가능 단계 목록 (보드 순서 유지) */
export function getMovableStages(current: Stage): Stage[] {
  return STAGES.filter((stage) => stage !== current)
}
