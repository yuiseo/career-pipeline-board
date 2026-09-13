import type { ReactNode } from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { STAGE_LABEL, type Stage } from "@/types/candidate"

/** 진행 단계 — 보드 컬럼 순서 (DESIGN §4-2) */
const PROGRESS_STAGES = [
  "document",
  "interview",
  "offer",
  "hired",
] as const satisfies readonly Stage[]

const REJECTED_STAGE = "rejected" as const satisfies Stage

const CURRENT_TAG_LABEL = "현재"
const REJECTED_MENU_LABEL = "불합격 처리"
const DEFAULT_TRIGGER_ARIA_LABEL = "단계 변경"

interface StageMoveMenuProps {
  currentStage: Stage
  onSelectStage: (stage: Stage) => void
  /** 요청 진행 중(in-flight)일 때 메뉴 비활성화 */
  disabled?: boolean
  /** 미지정 시 MoreHorizontal 아이콘 버튼 */
  trigger?: ReactNode
}

function CurrentTag() {
  return (
    <span className="ml-auto text-xs text-muted-foreground">
      {CURRENT_TAG_LABEL}
    </span>
  )
}

function StageMoveMenu({
  currentStage,
  onSelectStage,
  disabled = false,
  trigger,
}: StageMoveMenuProps) {
  const isCurrentProgress = (stage: Stage) => stage === currentStage
  const isRejectedCurrent = currentStage === REJECTED_STAGE

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        {trigger ?? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            aria-label={DEFAULT_TRIGGER_ARIA_LABEL}
          >
            <MoreHorizontal />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {PROGRESS_STAGES.map((stage) => {
          const isCurrent = isCurrentProgress(stage)

          return (
            <DropdownMenuItem
              key={stage}
              disabled={isCurrent}
              className={cn(isCurrent && "bg-muted")}
              onSelect={() => {
                onSelectStage(stage)
              }}
            >
              {STAGE_LABEL[stage]}
              {isCurrent ? <CurrentTag /> : null}
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isRejectedCurrent}
          className={cn(isRejectedCurrent && "bg-muted")}
          onSelect={() => {
            onSelectStage(REJECTED_STAGE)
          }}
        >
          {REJECTED_MENU_LABEL}
          {isRejectedCurrent ? <CurrentTag /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export type { StageMoveMenuProps }
export default StageMoveMenu
