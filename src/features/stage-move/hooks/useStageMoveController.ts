import { useRef } from "react"

import {
  STAGE_MOVE_ERROR_MESSAGE,
  STAGE_MOVE_UNDO_ACTION_LABEL,
  STAGE_MOVE_UNDO_COMPLETE_MESSAGE,
  stageMoveSuccessMessage,
} from "@/features/stage-move/constants"
import { useStageMoveStore } from "@/features/stage-move/hooks/useStageMoveStore"
import { useUpdateCandidateStage } from "@/features/stage-move/hooks/useUpdateCandidateStage"
import { useToastState } from "@/features/toast/hooks/useToastState"
import type { Stage } from "@/types/candidate"

/** HTTP 성공으로 확정된 최근 이동 (DECISIONS 2-8) */
type LastSuccessfulMove = {
  candidateId: string
  fromStage: Stage
  toStage: Stage
}

type StageMoveRequestOptions = {
  isUndo?: boolean
}

/**
 * 지원자별 단계 이동 큐·토스트 오케스트레이션 (DECISIONS 2-3 / SR-01).
 *
 * mutateAsync로 성공/실패를 기다려 inFlight가 응답 없이 남지 않게 한다.
 * 같은 지원자 직렬화는 스토어의 inFlight/pending으로 보장한다.
 */
export function useStageMoveController() {
  const updateStageMutation = useUpdateCandidateStage()
  const {
    byCandidateId,
    enqueueIntent,
    promotePendingOrClear,
    clearMoveState,
    getMoveState,
  } = useStageMoveStore()
  const { toasts, pushToast, dismissToast } = useToastState()
  const lastSuccessfulMoveRef = useRef<LastSuccessfulMove | null>(null)

  async function sendRequest(
    id: string,
    target: Stage,
    confirmedAtSend: Stage,
    options?: StageMoveRequestOptions
  ): Promise<void> {
    const isUndo = options?.isUndo === true

    try {
      const detail = await updateStageMutation.mutateAsync({
        id,
        stage: target,
      })

      const move: LastSuccessfulMove = {
        candidateId: id,
        fromStage: confirmedAtSend,
        toStage: detail.stage,
      }
      lastSuccessfulMoveRef.current = move

      // inFlight 정리·pending 승격을 토스트보다 먼저 해, 콜백 예외와 무관하게 스피너가 남지 않게 한다.
      const nextTarget = promotePendingOrClear(id, detail.stage)

      if (isUndo) {
        pushToast({
          variant: "undoComplete",
          message: STAGE_MOVE_UNDO_COMPLETE_MESSAGE,
        })
      } else {
        pushToast({
          variant: "success",
          message: stageMoveSuccessMessage(detail.stage),
          actionLabel: STAGE_MOVE_UNDO_ACTION_LABEL,
          onAction: () => {
            void requestStageMove(
              move.candidateId,
              move.toStage,
              move.fromStage,
              { isUndo: true }
            )
          },
        })
      }

      if (nextTarget != null) {
        await sendRequest(id, nextTarget, detail.stage)
      }
    } catch {
      clearMoveState(id)
      pushToast({
        variant: "error",
        message: STAGE_MOVE_ERROR_MESSAGE,
        onAction: () => {
          void requestStageMove(id, confirmedAtSend, target, options)
        },
      })
    }
  }

  function requestStageMove(
    id: string,
    confirmedStage: Stage,
    nextStage: Stage,
    options?: StageMoveRequestOptions
  ): void {
    const result = enqueueIntent(id, nextStage, confirmedStage)
    if (result === "send") {
      void sendRequest(id, nextStage, confirmedStage, options)
    }
  }

  return {
    byCandidateId,
    getMoveState,
    requestStageMove,
    toasts,
    dismissToast,
  }
}
