import { Skeleton } from "@/components/ui/skeleton"
import { STAGES } from "@/types/candidate"

const CARD_SKELETON_COUNT = 3

function BoardLoadingSkeleton() {
  return (
    <>
      {STAGES.map((stage) => (
        <section
          key={stage}
          aria-hidden="true"
          className="flex w-67 shrink-0 flex-col gap-1.5 rounded-lg bg-muted p-1.5"
        >
          <header className="flex shrink-0 items-center gap-2 px-1.5 py-1">
            <Skeleton className="size-2 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-auto h-5 w-7 rounded-full" />
          </header>
          <div className="flex flex-col gap-2">
            {Array.from({ length: CARD_SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                className="h-18 w-full rounded-lg bg-background"
              />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

export default BoardLoadingSkeleton
