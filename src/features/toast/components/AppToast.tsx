import { CheckCircle2, Circle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ToastVariant } from "@/features/toast/types"

interface AppToastProps {
  variant: ToastVariant
  message: string
  /** error 기본값: "다시 시도". onAction이 있을 때만 버튼을 렌더한다. */
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const DEFAULT_ERROR_ACTION_LABEL = "다시 시도"

function AppToast({
  variant,
  message,
  actionLabel,
  onAction,
  className,
}: AppToastProps) {
  const resolvedActionLabel =
    actionLabel ??
    (variant === "error" ? DEFAULT_ERROR_ACTION_LABEL : undefined)
  const showAction = onAction != null && resolvedActionLabel != null
  const isAlert = variant === "error"

  return (
    <div
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      className={cn(
        "flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 shadow-md",
        className
      )}
    >
      {variant === "success" ? (
        <CheckCircle2
          aria-hidden="true"
          className="size-5 shrink-0 text-stage-hired-dot"
        />
      ) : variant === "undoComplete" ? (
        <Circle
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
      ) : (
        <XCircle
          aria-hidden="true"
          className="size-5 shrink-0 text-destructive"
        />
      )}
      <p className="min-w-0 flex-1 text-sm text-foreground">{message}</p>
      {showAction ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onAction}
        >
          {resolvedActionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export default AppToast
