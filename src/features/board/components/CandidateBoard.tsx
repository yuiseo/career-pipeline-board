import { useState } from "react"

import { ApiError } from "@/api/http"
import CandidateDetailPanel from "@/features/candidate-detail/components/CandidateDetailPanel"
import { useCandidateDetailQuery } from "@/features/candidate-detail/hooks/useCandidateDetailQuery"
import { STAGES } from "@/types/candidate"

import { useCandidatesQuery } from "../hooks/useCandidatesQuery"
import { groupCandidatesByStage } from "../utils/groupCandidatesByStage"
import BoardColumn from "./BoardColumn"
import BoardEmptyView from "./BoardEmptyView"
import BoardErrorView from "./BoardErrorView"
import BoardLoadingSkeleton from "./BoardLoadingSkeleton"
import CandidateCard from "./CandidateCard"

function CandidateBoard() {
  const { data, error, isPending, isError, refetch } = useCandidatesQuery()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const detailQuery = useCandidateDetailQuery(selectedId)

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

  const byStage = groupCandidatesByStage(data)
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
            {columnCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={selectedId === candidate.id}
                onOpenDetail={setSelectedId}
              />
            ))}
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
      />
    </>
  )
}

export default CandidateBoard
