import { STAGE_LABEL, type Stage } from "@/types/candidate"

/** 단계 이동 성공 토스트 (SPEC/DESIGN 문구 미지정 → DECISIONS 가정) */
export function stageMoveSuccessMessage(stage: Stage): string {
  return `${STAGE_LABEL[stage]} 단계로 이동했습니다`
}
