import { useState } from "react"

import { ApiError } from "@/api/http"
import CandidateDetailPanel from "@/features/candidate-detail/components/CandidateDetailPanel"
import { useCandidateDetailQuery } from "@/features/candidate-detail/hooks/useCandidateDetailQuery"
import { filterCandidates } from "@/features/filters/filterCandidates"
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
