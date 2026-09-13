import { useState } from "react"

import { ApiError } from "@/api/http"
import { Button } from "@/components/ui/button"
import CandidateDetailPanel from "@/features/candidate-detail/components/CandidateDetailPanel"
import { useCandidateDetailQuery } from "@/features/candidate-detail/hooks/useCandidateDetailQuery"
import { filterCandidates } from "@/features/filters/filterCandidates"
import { stageMoveSuccessMessage } from "@/features/stage-move/constants"
import StageMoveMenu from "@/features/stage-move/components/StageMoveMenu"
import { useUpdateCandidateStage } from "@/features/stage-move/hooks/useUpdateCandidateStage"
import Toaster from "@/features/toast/components/Toaster"
import { useToastState } from "@/features/toast/hooks/useToastState"
import type { Position, Stage } from "@/types/candidate"
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
  const updateStageMutation = useUpdateCandidateStage()
  const { toasts, pushToast, dismissToast } = useToastState()

  const inFlightId = updateStageMutation.isPending
    ? updateStageMutation.variables?.id
    : undefined

  const requestStageMove = (
    id: string,
    currentStage: Stage,
    nextStage: Stage
  ) => {
    if (nextStage === currentStage) return

    updateStageMutation.mutate(
      { id, stage: nextStage },
      {
        onSuccess: (detail) => {
          pushToast({
            variant: "success",
            message: stageMoveSuccessMessage(detail.stage),
          })
        },
      }
    )
  }

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

  const byStage = groupCandidatesByStage(filtered)
  const summary =
    selectedId == null
      ? null
      : (data.find((candidate) => candidate.id === selectedId) ?? null)

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
              const isMoving = inFlightId === candidate.id

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
                      disabled={isMoving}
                      onSelectStage={(nextStage) => {
                        requestStageMove(
                          candidate.id,
                          candidate.stage,
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
        stageMoveSlot={
          summary ? (
            <StageMoveMenu
              currentStage={summary.stage}
              disabled={inFlightId === summary.id}
              onSelectStage={(nextStage) => {
                requestStageMove(summary.id, summary.stage, nextStage)
              }}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={inFlightId === summary.id}
                >
                  단계 변경
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
