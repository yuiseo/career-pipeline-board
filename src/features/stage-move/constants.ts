import { STAGE_LABEL, type Stage } from "@/types/candidate"

/** 단계 이동 성공 토스트 (SPEC/DESIGN 문구 미지정 → DECISIONS 가정) */
export function stageMoveSuccessMessage(stage: Stage): string {
  return `${STAGE_LABEL[stage]} 단계로 이동했습니다`
}

/** 단계 이동 실패 토스트 (SPEC/DESIGN 문구 미지정 → DECISIONS 가정) */
export const STAGE_MOVE_ERROR_MESSAGE = "단계 이동에 실패했습니다"

/** 성공 토스트 Undo 액션 (DECISIONS 2-8 / DESIGN §4-4) */
export const STAGE_MOVE_UNDO_ACTION_LABEL = "실행 취소"

/** Undo 성공 토스트 (DECISIONS 2-8 / DESIGN §4-4 undoComplete) */
export const STAGE_MOVE_UNDO_COMPLETE_MESSAGE = "이동을 취소했습니다"
