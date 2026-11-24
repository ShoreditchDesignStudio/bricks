import type { ComponentType, ReactNode } from "react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bricks/ui/empty"
import { cn } from "@/registry/bricks/lib/utils"

/**
 * Empty, error and locked screens all share this shape: centred both ways,
 * a title, at most one short line, and at most one action (usually primary,
 * with no icon).
 *
 * Pass `icon` for a compact state (a 20px icon and a Sentient panel title), or `art`
 * for an illustrated one (your own 144px artwork, the display face and a
 * larger support line). Art replaces the icon.
 */
export function StateMessage({
  icon: Icon,
  art,
  title,
  body,
  action,
  className,
}: {
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  art?: ReactNode
  title: string
  body?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <Empty className={cn("mx-auto max-w-[720px] gap-3 p-6 md:p-8", className)}>
      <EmptyHeader className="gap-1">
        {art || Icon ? (
          <EmptyMedia className="mb-1 text-muted-foreground">
            {art ? (
              <div className="size-36 [&>*]:size-full">{art}</div>
            ) : Icon ? (
              <Icon aria-hidden className="size-5" />
            ) : null}
          </EmptyMedia>
        ) : null}
        {/* Both set titles in Sentient: illustrated states at page-title size with larger copy, compact ones at panel size. */}
        <EmptyTitle className={art ? "font-display text-page-title" : "text-display-panel"}>
          {title}
        </EmptyTitle>
        {body ? (
          <EmptyDescription className={art ? "text-[15px] leading-6 text-pretty" : "text-body text-pretty"}>
            {body}
          </EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}
