import { InboxIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type BoardEmptyViewProps =
  | {
      variant: "all"
      onResetFilters?: never
    }
  | {
      variant: "filtered"
      onResetFilters: () => void
    }

function BoardEmptyView(props: BoardEmptyViewProps) {
  if (props.variant === "filtered") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-center">
        <SearchXIcon
          aria-hidden="true"
          className="size-10 text-muted-foreground"
        />
        <p className="text-body text-muted-foreground">
          조건에 맞는 지원자가 없습니다
        </p>
        <Button type="button" variant="outline" onClick={props.onResetFilters}>
          검색·필터 초기화
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-center">
      <InboxIcon aria-hidden="true" className="size-10 text-muted-foreground" />
      <p className="text-body text-muted-foreground">
        등록된 지원자가 없습니다
      </p>
    </div>
  )
}

export default BoardEmptyView
