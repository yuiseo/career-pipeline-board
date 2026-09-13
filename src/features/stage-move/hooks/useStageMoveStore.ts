import { useState } from "react"

import type { Stage } from "@/types/candidate"

import type { CandidateStageMoveState } from "../getDisplayStage"

export type EnqueueIntentResult = "send" | "queued" | "noop"

export function useStageMoveStore() {
  const [byCandidateId, setByCandidateId] = useState<
    ReadonlyMap<string, CandidateStageMoveState>
  >(() => new Map())

  /**
   * 사용자 이동 의도 반영.
   * - in-flight 없음: 확인된 단계와 같으면 noop, 아니면 inFlightTarget 설정 후 send
   * - in-flight 있음: pendingTarget을 덮어쓰고 queued (병렬 요청 없음)
   */
  function enqueueIntent(
    id: string,
    stage: Stage,
    confirmedStage: Stage
  ): EnqueueIntentResult {
    let result: EnqueueIntentResult = "noop"
    setByCandidateId((previous) => {
      const current = previous.get(id)
      if (current?.inFlightTarget != null) {
        result = "queued"
        const next = new Map(previous)
        next.set(id, {
          inFlightTarget: current.inFlightTarget,
          pendingTarget: stage,
        })
        return next
      }

      if (stage === confirmedStage) {
        result = "noop"
        return previous
      }

      result = "send"
      const next = new Map(previous)
      next.set(id, { inFlightTarget: stage })
      return next
    })
    return result
  }

  /**
   * 진행 요청 성공 후 pending 승격 또는 상태 해제.
   * pending이 새 confirmed와 다르면 inFlight로 올리고 그 단계를 반환(전송).
   * 같거나 없으면 상태를 비우고 undefined 반환.
   */
  function promotePendingOrClear(
    id: string,
    confirmedStage: Stage
  ): Stage | undefined {
    let nextTarget: Stage | undefined
    setByCandidateId((previous) => {
      const current = previous.get(id)
      if (current == null) return previous

      const pending = current.pendingTarget
      if (pending != null && pending !== confirmedStage) {
        nextTarget = pending
        const next = new Map(previous)
        next.set(id, { inFlightTarget: pending })
        return next
      }

      const next = new Map(previous)
      next.delete(id)
      return next
    })
    return nextTarget
  }

  /** 실패 시 inFlight·pending 모두 폐기 */
  function clearMoveState(id: string) {
    setByCandidateId((previous) => {
      if (!previous.has(id)) return previous
      const next = new Map(previous)
      next.delete(id)
      return next
    })
  }

  function getMoveState(id: string): CandidateStageMoveState | undefined {
    return byCandidateId.get(id)
  }

  return {
    byCandidateId,
    enqueueIntent,
    promotePendingOrClear,
    clearMoveState,
    getMoveState,
  }
}
