import AppToast from "@/features/toast/components/AppToast"
import type { ToastItem } from "@/features/toast/types"
import { cn } from "@/lib/utils"

interface ToasterProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  className?: string
}

/**
 * 토스트 스택 컨테이너.
 * 위치: 우하단 fixed (DESIGN.md 미지정 → DECISIONS 가정).
 */
function Toaster({ toasts, onDismiss, className }: ToasterProps) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      aria-label="알림"
      className={cn(
        "pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2",
        className
      )}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <AppToast
            variant={toast.variant}
            message={toast.message}
            actionLabel={toast.actionLabel}
            onAction={
              toast.onAction
                ? () => {
                    toast.onAction?.()
                    onDismiss(toast.id)
                  }
                : undefined
            }
          />
        </div>
      ))}
    </div>
  )
}

export default Toaster
