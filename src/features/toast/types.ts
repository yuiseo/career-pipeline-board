/**
 * Must: `success` | `error`
 * Should(Undo) 확장 여지: `undoComplete` 및 success 액션("실행 취소")
 */
export type ToastVariant = "success" | "error"

export type ToastItem = {
  id: string
  variant: ToastVariant
  message: string
  /** 미지정 시 error + onAction이면 "다시 시도" */
  actionLabel?: string
  onAction?: () => void
}
