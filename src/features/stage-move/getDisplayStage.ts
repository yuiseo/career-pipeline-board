import type { Stage } from "@/types/candidate"

/** 지원자별 이동 상태 (DECISIONS 2-3 / SR-01) */
export type CandidateStageMoveState = {
  inFlightTarget?: Stage
  pendingTarget?: Stage
}

/**
 * 화면 표시 단계.
 * 우선순위: pendingTarget → inFlightTarget → confirmedStage
 */
export function getDisplayStage(
  confirmedStage: Stage,
  moveState?: Pick<CandidateStageMoveState, "inFlightTarget" | "pendingTarget">
): Stage {
  return moveState?.pendingTarget ?? moveState?.inFlightTarget ?? confirmedStage
}
