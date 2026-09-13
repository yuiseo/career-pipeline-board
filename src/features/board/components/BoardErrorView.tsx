import { CircleAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const DEFAULT_ERROR_MESSAGE = "지원자 목록을 불러오지 못했습니다."

interface BoardErrorViewProps {
  onRetry: () => void
  message?: string
}

function BoardErrorView({
  onRetry,
  message = DEFAULT_ERROR_MESSAGE,
}: BoardErrorViewProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-center">
      <CircleAlertIcon
        aria-hidden="true"
        className="size-10 text-muted-foreground"
      />
      <p className="text-body text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  )
}

export default BoardErrorView
