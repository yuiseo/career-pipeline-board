import { useCallback, useRef, useState } from "react"

import type { ToastItem } from "@/features/toast/types"

/** 성공 토스트 자동 닫힘 (DESIGN/SPEC 미지정 → DECISIONS 가정) */
const TOAST_AUTO_DISMISS_MS = 3_000

type PushToastInput = Omit<ToastItem, "id">

let toastIdSeq = 0

function nextToastId(): string {
  toastIdSeq += 1
  return `toast-${toastIdSeq}`
}

export function useToastState() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  )

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer != null) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (input: PushToastInput) => {
      const id = nextToastId()
      const item: ToastItem = { ...input, id }
      setToasts((previous) => [...previous, item])

      if (input.variant === "success") {
        const timer = setTimeout(() => {
          dismissToast(id)
        }, TOAST_AUTO_DISMISS_MS)
        timersRef.current.set(id, timer)
      }

      return id
    },
    [dismissToast]
  )

  return { toasts, pushToast, dismissToast }
}
