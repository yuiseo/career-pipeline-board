import { useState } from "react"

import type { Stage } from "@/types/candidate"

import type { CandidateStageMoveState } from "../getDisplayStage"

export function useStageMoveStore() {
  const [byCandidateId, setByCandidateId] = useState<
    ReadonlyMap<string, CandidateStageMoveState>
  >(() => new Map())

  /** 이미 in-flight면 false. 적용되면 true. */
  function setInFlight(id: string, stage: Stage): boolean {
    let applied = false
    setByCandidateId((previous) => {
      if (previous.get(id)?.inFlightTarget != null) {
        return previous
      }
      applied = true
      const next = new Map(previous)
      next.set(id, { inFlightTarget: stage })
      return next
    })
    return applied
  }

  function clearInFlight(id: string) {
    setByCandidateId((previous) => {
      if (!previous.has(id)) return previous
      const next = new Map(previous)
      next.delete(id)
      return next
    })
  }

  function getInFlightTarget(id: string): Stage | undefined {
    return byCandidateId.get(id)?.inFlightTarget
  }

  return {
    byCandidateId,
    setInFlight,
    clearInFlight,
    getInFlightTarget,
  }
}
