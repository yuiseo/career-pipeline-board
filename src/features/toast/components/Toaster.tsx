import { createPortal } from "react-dom"

import AppToast from "@/features/toast/components/AppToast"
import type { ToastItem } from "@/features/toast/types"
import { cn } from "@/lib/utils"

/** Sheet(z-50)보다 위에 두어 상세 패널이 열려도 토스트가 보이게 한다. */
const TOAST_STACK_Z_CLASS = "z-[100]"

/** Sheet 바깥 클릭 판별용 — 토스트 클릭 시 패널이 닫히지 않게 한다. */
export const TOASTER_ATTR = "data-toaster"

interface ToasterProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  className?: string
}

/**
 * 토스트 스택 컨테이너.
 * 위치: 하단 중앙 (상세 슬라이드 아웃과 겹치지 않도록).
 * document.body로 포털해 Sheet 오버레이 위에 그린다.
 */
function Toaster({ toasts, onDismiss, className }: ToasterProps) {
  if (toasts.length === 0) {
    return null
  }

  return createPortal(
    <div
      {...{ [TOASTER_ATTR]: "" }}
      aria-label="알림"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 flex flex-col items-center gap-2",
        TOAST_STACK_Z_CLASS,
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
    </div>,
    document.body
  )
}

export default Toaster
