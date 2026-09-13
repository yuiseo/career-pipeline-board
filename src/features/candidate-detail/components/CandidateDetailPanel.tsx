import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import StageBadge from "@/features/board/components/StageBadge"
import { TOASTER_ATTR } from "@/features/toast/components/Toaster"
import { cn } from "@/lib/utils"
import {
  POSITION_LABEL,
  type CandidateDetail,
  type CandidateSummary,
  type Stage,
} from "@/types/candidate"

function isToasterEventTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest(`[${TOASTER_ATTR}]`) != null
  )
}

/** DESIGN.md §4-3 — 상세 패널 너비 420px (= Tailwind spacing 105 × 0.25rem) */
const DETAIL_PANEL_WIDTH_CLASS = "w-105 sm:max-w-105"

interface CandidateDetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 헤더·지원일 — 목록 캐시 기준, 상세 로딩/에러와 무관하게 표시 */
  summary: CandidateSummary | null
  /** 이메일·연락처·경력·학력 — 상세 조회 성공 시에만 */
  detail: CandidateDetail | null
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  /** 푸터 단계 변경 메뉴 슬롯 (StageMoveMenu는 호출측에서 주입) */
  stageMoveSlot?: ReactNode
  /** 낙관적 표시용 단계 — 없으면 summary.stage */
  displayStage?: Stage
}

function getInitials(name: string): string {
  const trimmed = name.trim()
  if (trimmed.length === 0) return "?"

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0]?.charAt(0) ?? ""
    const second = parts[1]?.charAt(0) ?? ""
    return (first + second).toUpperCase()
  }

  return trimmed.slice(0, 1)
}

interface DetailFieldRowProps {
  label: string
  children: ReactNode
}

function DetailFieldRow({ label, children }: DetailFieldRowProps) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-start gap-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-body text-foreground wrap-break-word">
        {children}
      </dd>
    </div>
  )
}

function CandidateDetailPanel({
  open,
  onOpenChange,
  summary,
  detail,
  isLoading = false,
  isError = false,
  onRetry,
  stageMoveSlot,
  displayStage,
}: CandidateDetailPanelProps) {
  const stage = displayStage ?? summary?.stage

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="bg-[oklch(0_0_0/0.38)]"
        className={cn("gap-0 p-0", DETAIL_PANEL_WIDTH_CLASS)}
        onPointerDownOutside={(event) => {
          // 하단 중앙 토스트(실행 취소·다시 시도) 클릭이 패널 바깥 클릭으로 닫히지 않게 한다.
          if (isToasterEventTarget(event.target)) {
            event.preventDefault()
          }
        }}
        onInteractOutside={(event) => {
          if (isToasterEventTarget(event.target)) {
            event.preventDefault()
          }
        }}
        onFocusOutside={(event) => {
          if (isToasterEventTarget(event.target)) {
            event.preventDefault()
          }
        }}
      >
        {summary ? (
          <>
            <SheetHeader className="border-b border-border p-5">
              <div className="flex items-start gap-3 pr-8">
                <div
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-body font-semibold text-muted-foreground"
                >
                  {getInitials(summary.name)}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <SheetTitle className="text-panel-name font-bold leading-tight">
                    {summary.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    {POSITION_LABEL[summary.position]}
                  </SheetDescription>
                  {stage ? <StageBadge stage={stage} /> : null}
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 py-2">
              {isError ? (
                <div
                  role="alert"
                  className="my-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3"
                >
                  <p className="text-body text-destructive">
                    상세 정보를 불러오지 못했습니다
                  </p>
                  {onRetry ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={onRetry}
                    >
                      다시 시도
                    </Button>
                  ) : null}
                </div>
              ) : (
                <dl className="divide-y divide-border">
                  <DetailFieldRow label="이메일">
                    {isLoading ? (
                      <Skeleton className="h-4 w-40" />
                    ) : (
                      (detail?.email ?? null)
                    )}
                  </DetailFieldRow>
                  <DetailFieldRow label="연락처">
                    {isLoading ? (
                      <Skeleton className="h-4 w-28" />
                    ) : (
                      (detail?.phone ?? null)
                    )}
                  </DetailFieldRow>
                  <DetailFieldRow label="경력 연차">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : detail != null ? (
                      `${detail.experienceYears}년`
                    ) : null}
                  </DetailFieldRow>
                  <DetailFieldRow label="최종학력">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      (detail?.education ?? null)
                    )}
                  </DetailFieldRow>
                  <DetailFieldRow label="지원일">
                    <time dateTime={summary.appliedAt}>
                      {summary.appliedAt}
                    </time>
                  </DetailFieldRow>
                </dl>
              )}
            </div>

            {stageMoveSlot ? (
              <SheetFooter className="border-t border-border p-5">
                {stageMoveSlot}
              </SheetFooter>
            ) : null}
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default CandidateDetailPanel
