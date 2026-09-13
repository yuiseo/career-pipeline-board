import type { KeyboardEvent, ReactNode } from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { POSITION_LABEL, type CandidateSummary } from "@/types/candidate"

import StageBadge from "./StageBadge"

/** DESIGN §3-3: 상세 열림(선택됨) — `--ring` 색 3px 링 */
const SELECTED_RING_CLASS = "ring-3 ring-ring"

/** DESIGN §3-3: 키보드 포커스 — outline 2px / offset 2px */
const FOCUS_RING_CLASS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const MOVING_LABEL = "이동 중"

interface CandidateCardProps {
  candidate: CandidateSummary
  onOpenDetail: (id: string) => void
  /** 상세 패널이 이 카드를 보고 있을 때 */
  selected?: boolean
  /** 상단 행 우측 — 단계 변경 트리거 슬롯 (메뉴는 부모가 주입) */
  stageMoveSlot?: ReactNode
  /** 단계 이동 요청 진행 중 — 스피너 + "이동 중" (메뉴는 유지, SR-01) */
  isMoving?: boolean
}

function isOpenDetailKey(key: string): boolean {
  return key === "Enter" || key === " "
}

function CandidateCard({
  candidate,
  onOpenDetail,
  selected = false,
  stageMoveSlot,
  isMoving = false,
}: CandidateCardProps) {
  const openDetail = () => {
    onOpenDetail(candidate.id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (!isOpenDetailKey(event.key)) return
    event.preventDefault()
    openDetail()
  }

  return (
    <li
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-busy={isMoving || undefined}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col gap-1.5 rounded-lg border border-border bg-card p-2.5 shadow-xs",
        "text-left outline-none",
        FOCUS_RING_CLASS,
        selected && SELECTED_RING_CLASS
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-card-name font-semibold text-card-foreground">
            {candidate.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {POSITION_LABEL[candidate.position]}
          </p>
        </div>
        {(stageMoveSlot != null || isMoving) && (
          <div
            className="flex shrink-0 items-center gap-1"
            onClick={(event) => {
              event.stopPropagation()
            }}
            onKeyDown={(event) => {
              event.stopPropagation()
            }}
          >
            {isMoving ? (
              <span
                className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-meta text-muted-foreground"
                aria-live="polite"
              >
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                {MOVING_LABEL}
              </span>
            ) : null}
            {stageMoveSlot}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <time
          className="text-meta text-muted-foreground tabular-nums"
          dateTime={candidate.appliedAt}
        >
          {candidate.appliedAt}
        </time>
        <StageBadge stage={candidate.stage} />
      </div>
    </li>
  )
}

export default CandidateCard
export type { CandidateCardProps }
