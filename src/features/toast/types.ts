/**
 * Must: `success` | `error`
 * Should(Undo): `undoComplete` · success 액션("실행 취소") — DECISIONS 2-8
 */
export type ToastVariant = "success" | "error" | "undoComplete"

export type ToastItem = {
  id: string
  variant: ToastVariant
  message: string
  /** 미지정 시 error + onAction이면 "다시 시도" */
  actionLabel?: string
  onAction?: () => void
}
