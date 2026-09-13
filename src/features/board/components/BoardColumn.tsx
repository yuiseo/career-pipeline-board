import { useId, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { STAGE_LABEL, type Stage } from "@/types/candidate"

interface BoardColumnProps {
  stage: Stage
  /** 헤더에 표시할 인원수 (검색·필터 적용 후 건수) */
  count: number
  /** 카드 목록. 각 항목은 `<li>`로 렌더한다 */
  children?: ReactNode
}

const STAGE_DOT_CLASS: Record<Stage, string> = {
  document: "bg-stage-document-dot",
  interview: "bg-stage-interview-dot",
  offer: "bg-stage-offer-dot",
  hired: "bg-stage-hired-dot",
  rejected: "bg-stage-rejected-dot",
}

function BoardColumn({ stage, count, children }: BoardColumnProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="flex w-67 shrink-0 flex-col gap-1.5 rounded-lg bg-muted p-1.5"
    >
      <header className="flex shrink-0 items-center gap-2 px-1.5 py-1">
        <span
          aria-hidden="true"
          className={cn("size-2 shrink-0 rounded-full", STAGE_DOT_CLASS[stage])}
        />
        <h2 id={titleId} className="truncate text-body font-semibold">
          {STAGE_LABEL[stage]}
        </h2>
        <span className="ml-auto inline-flex h-5 shrink-0 items-center rounded-full border border-border bg-background px-2 text-xs font-medium text-muted-foreground tabular-nums">
          {count}
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {count === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            이 단계의 지원자가 없습니다
          </p>
        ) : (
          <ul className="flex flex-col gap-2">{children}</ul>
        )}
      </div>
    </section>
  )
}

export default BoardColumn
