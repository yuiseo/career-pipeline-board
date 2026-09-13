import { useState } from "react"

import { ApiError } from "@/api/http"
import { Button } from "@/components/ui/button"
import CandidateDetailPanel from "@/features/candidate-detail/components/CandidateDetailPanel"
import { useCandidateDetailQuery } from "@/features/candidate-detail/hooks/useCandidateDetailQuery"
import { filterCandidates } from "@/features/filters/filterCandidates"
import StageMoveMenu from "@/features/stage-move/components/StageMoveMenu"
import { getDisplayStage } from "@/features/stage-move/getDisplayStage"
import { useStageMoveController } from "@/features/stage-move/hooks/useStageMoveController"
import Toaster from "@/features/toast/components/Toaster"
import type { Position } from "@/types/candidate"
import { STAGES } from "@/types/candidate"

import { useCandidatesQuery } from "../hooks/useCandidatesQuery"
import { groupCandidatesByStage } from "../utils/groupCandidatesByStage"
import BoardColumn from "./BoardColumn"
import BoardEmptyView from "./BoardEmptyView"
import BoardErrorView from "./BoardErrorView"
import BoardLoadingSkeleton from "./BoardLoadingSkeleton"
import CandidateCard from "./CandidateCard"

interface CandidateBoardProps {
  nameQuery: string
  positions: ReadonlyArray<Position>
  onResetFilters: () => void
}

function CandidateBoard({
  nameQuery,
  positions,
  onResetFilters,
}: CandidateBoardProps) {
  const { data, error, isPending, isError, refetch } = useCandidatesQuery()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const detailQuery = useCandidateDetailQuery(selectedId)
  const {
    byCandidateId,
    getMoveState,
    requestStageMove,
    toasts,
    dismissToast,
  } = useStageMoveController()

  if (isPending) {
    return <BoardLoadingSkeleton />
  }

  if (isError) {
    const message = error instanceof ApiError ? error.message : undefined
    return (
      <BoardErrorView
        message={message}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (data.length === 0) {
    return <BoardEmptyView variant="all" />
  }

  const filtered = filterCandidates(data, { nameQuery, positions })

  if (filtered.length === 0) {
    return <BoardEmptyView variant="filtered" onResetFilters={onResetFilters} />
  }

  const displayCandidates = filtered.map((candidate) => {
    const moveState = byCandidateId.get(candidate.id)
    return {
      ...candidate,
      stage: getDisplayStage(candidate.stage, moveState),
    }
  })
  const byStage = groupCandidatesByStage(displayCandidates)
  const confirmedStageById = new Map(
    filtered.map((candidate) => [candidate.id, candidate.stage])
  )
  const summary =
    selectedId == null
      ? null
      : (data.find((candidate) => candidate.id === selectedId) ?? null)
  const summaryMoveState =
    summary == null ? undefined : getMoveState(summary.id)
  const summaryDisplayStage =
    summary == null
      ? undefined
      : getDisplayStage(summary.stage, summaryMoveState)
  const summaryIsMoving = summaryMoveState?.inFlightTarget != null

  return (
    <>
      {STAGES.map((stage) => {
        const columnCandidates = byStage[stage]
        return (
          <BoardColumn
            key={stage}
            stage={stage}
            count={columnCandidates.length}
          >
            {columnCandidates.map((candidate) => {
              const confirmedStage =
                confirmedStageById.get(candidate.id) ?? candidate.stage
              const isMoving =
                getMoveState(candidate.id)?.inFlightTarget != null

              return (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  selected={selectedId === candidate.id}
                  onOpenDetail={setSelectedId}
                  isMoving={isMoving}
                  stageMoveSlot={
                    <StageMoveMenu
                      currentStage={candidate.stage}
                      onSelectStage={(nextStage) => {
                        requestStageMove(
                          candidate.id,
                          confirmedStage,
                          nextStage
                        )
                      }}
                    />
                  }
                />
              )
            })}
          </BoardColumn>
        )
      })}
      <CandidateDetailPanel
        open={selectedId != null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null)
          }
        }}
        summary={summary}
        detail={detailQuery.data ?? null}
        isLoading={detailQuery.isLoading}
        isError={detailQuery.isError}
        onRetry={() => {
          void detailQuery.refetch()
        }}
        displayStage={summaryDisplayStage}
        stageMoveSlot={
          summary && summaryDisplayStage != null ? (
            <StageMoveMenu
              currentStage={summaryDisplayStage}
              onSelectStage={(nextStage) => {
                requestStageMove(summary.id, summary.stage, nextStage)
              }}
              trigger={
                <Button type="button" variant="outline" className="w-full">
                  {summaryIsMoving ? "이동 중…" : "단계 변경"}
                </Button>
              }
            />
          ) : null
        }
      />
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

export default CandidateBoard
