import type { ReactNode } from "react"
import { cn } from "@/registry/bricks/lib/utils"

// Information blocks, in one place. Any stack of details (a details panel,
// a settings rail, a form, a dialog body) is built from these, so changing
// the spacing here changes it everywhere.
//
//   panel padding      20px   InfoStack
//   between groups     24px   InfoGroup, with a hairline between
//   property rows      36px+  PropertyList, label in a 96px lane
//   image to title     16px   MediaHead
//   title to support    8px   MediaHead
//   pinned action      20px   InfoFooter

const INFO_PADDING = "p-5"

export function InfoStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col", INFO_PADDING, className)}>{children}</div>
}

export function InfoGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("border-t py-6 first:border-t-0 first:pt-0 last:pb-0", className)}>
      {children}
    </section>
  )
}

export function InfoFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("shrink-0 border-t", INFO_PADDING, className)}>{children}</div>
}

/**
 * A scrolling stack of groups with its actions pinned beneath it. Buttons in
 * the footer sit side by side with an 8px gap; give each `flex-1`.
 *
 * `stacked` puts the footer's buttons one above the other at full width: at
 * most a secondary, then the primary under it.
 */
export function InfoPanel({
  children,
  footer,
  stacked = false,
}: {
  children: ReactNode
  footer?: ReactNode
  stacked?: boolean
}) {
  return (
    <>
      <InfoStack className="min-h-0 flex-1 overflow-y-auto">{children}</InfoStack>
      {footer ? (
        <InfoFooter className={cn("flex gap-2", stacked && "flex-col [&>*]:w-full")}>{footer}</InfoFooter>
      ) : null}
    </>
  )
}

export function MediaHead({
  media,
  title,
  support,
}: {
  media: ReactNode
  title: ReactNode
  support: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      {media}
      <div className="flex flex-col gap-2">
        <h2 className="text-panel-title">{title}</h2>
        <div className="text-meta text-muted-foreground tabular-nums">{support}</div>
      </div>
    </div>
  )
}

export type Property = {
  label: string
  value: ReactNode
  // Long values (a description, a list of names) top-align with their label.
  block?: boolean
}

export function PropertyList({ items }: { items: Property[] }) {
  return (
    <dl className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "grid min-h-9 grid-cols-[6rem_minmax(0,1fr)] gap-x-3",
            item.block ? "items-start py-2" : "items-center py-1"
          )}
        >
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
