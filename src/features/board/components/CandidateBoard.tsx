import { useState } from "react"

import { ApiError } from "@/api/http"
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
    </>
  )
}

export default CandidateBoard
