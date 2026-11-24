"use client"

import type { ComponentProps, ReactNode } from "react"
import { XIcon } from "@phosphor-icons/react"
import { Button } from "@/registry/bricks/ui/button"
import { cn } from "@/registry/bricks/lib/utils"

/**
 * The 320px details panel on the right of the content. It sits beside the
 * content from `lg` and overlays it below, so the parent must be
 * `position: relative`.
 *
 * With a `title`, the top edge names the item (title, subtitle) and carries
 * its icon-only actions (`DetailAction`) on the right. Without one it's the
 * plain 40px "Details" bar, for empty and not-found states.
 *
 * `onClose` adds a close button, shown only while the panel overlays the
 * content (below `lg`); beside the content there's nothing to close.
 */
export function DetailPanel({
  children,
  onClose,
  className,
  title,
  subtitle,
  actions,
  label = "Details",
}: {
  children: ReactNode
  onClose?: () => void
  className?: string
  title?: ReactNode
  subtitle?: ReactNode
  /** Icon-only actions on the item (`DetailAction`), beside the title. */
  actions?: ReactNode
  /** The bar's label when there's no title. */
  label?: string
}) {
  return (
    <aside
      className={cn(
        "absolute inset-y-0 right-0 z-10 flex w-full max-w-80 flex-col overflow-hidden border-l bg-background lg:static lg:z-auto lg:w-80 lg:shrink-0",
        className
      )}
    >
      {title ? (
        <div className="flex shrink-0 items-start gap-6 border-b py-3 pr-3 pl-5">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
            <h2 className="line-clamp-2 text-display-panel break-words">{title}</h2>
            {subtitle ? (
              <div className="truncate text-meta text-muted-foreground tabular-nums">{subtitle}</div>
            ) : null}
          </div>
          {actions || onClose ? (
            <div className="flex shrink-0 items-center gap-0.5">
              {actions}
              {onClose ? <CloseDetails onClose={onClose} className="lg:hidden" /> : null}
            </div>
          ) : null}
        </div>
      ) : (
        /* 40px, the same as a toolbar beside it, so the two rules line up. */
        <div className="flex h-10 shrink-0 items-center justify-between border-b pr-2 pl-4">
          <span className="text-meta text-muted-foreground">{label}</span>
          {onClose ? <CloseDetails onClose={onClose} className="lg:hidden" /> : null}
        </div>
      )}
      {children}
    </aside>
  )
}

function CloseDetails({ onClose, className }: { onClose: () => void; className?: string }) {
  return (
    <Button variant="ghost" size="icon-row" className={className} aria-label="Close details" onClick={onClose}>
      <XIcon aria-hidden />
    </Button>
  )
}

/**
 * An icon-only action in the details header: Edit, Delete. Always neutral;
 * the red belongs to the confirm button in the dialog it opens.
 */
export function DetailAction({
  label,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "variant" | "size"> & { label: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-row"
      className={className}
      aria-label={label}
      title={label}
      {...props}
    />
  )
}
