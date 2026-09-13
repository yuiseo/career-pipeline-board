import { cn } from "@/lib/utils"
import { STAGE_LABEL, type Stage } from "@/types/candidate"

interface StageBadgeProps {
  stage: Stage
  className?: string
}

const STAGE_BADGE_CLASS: Record<Stage, string> = {
  document: "bg-stage-document-bg text-stage-document-text",
  interview: "bg-stage-interview-bg text-stage-interview-text",
  offer: "bg-stage-offer-bg text-stage-offer-text",
  hired: "bg-stage-hired-bg text-stage-hired-text",
  rejected: "bg-stage-rejected-bg text-stage-rejected-text",
}

function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-meta font-medium",
        STAGE_BADGE_CLASS[stage],
        className
      )}
    >
      {STAGE_LABEL[stage]}
    </span>
  )
}

export default StageBadge
