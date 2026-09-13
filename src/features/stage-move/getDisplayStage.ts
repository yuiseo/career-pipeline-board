import type { Stage } from "@/types/candidate"

/** 지원자별 이동 중 상태 (Must: inFlightTarget만. pendingTarget은 Should) */
export type CandidateStageMoveState = {
  inFlightTarget?: Stage
}

/**
 * 화면 표시 단계 (FR-03 Must).
 * 우선순위: inFlightTarget → confirmedStage
 */
export function getDisplayStage(
  confirmedStage: Stage,
  inFlightTarget?: Stage
): Stage {
  return inFlightTarget ?? confirmedStage
}
