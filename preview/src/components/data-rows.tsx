"use client"

import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type DataColumn<Row> = {
  id: string
  header: string
  // Omit on exactly one column: that one flexes and truncates.
  width?: number
  // Drops the column when the rows themselves get narrow, e.g. with a panel open.
  hideBelow?: "md" | "xl" | "2xl" | "3xl"
  // Fixed columns read as secondary unless marked strong.
  strong?: boolean
  cell: (row: Row) => ReactNode
}

// Container variants key off the width of the rows, not the window, so columns
// drop correctly when a details panel or a rail takes up room.
const HIDE_BELOW = {
  md: "hidden @md/rows:block",
  xl: "hidden @xl/rows:block",
  "2xl": "hidden @2xl/rows:block",
  "3xl": "hidden @3xl/rows:block",
} as const

function cellProps<Row>(column: DataColumn<Row>) {
  return {
    className: cn(
      "truncate",
      column.width === undefined ? "min-w-0 flex-1" : "shrink-0",
      column.width !== undefined && !column.strong && "text-muted-foreground",
      column.hideBelow && HIDE_BELOW[column.hideBelow]
    ),
    style: column.width === undefined ? undefined : { width: column.width },
  }
}

const ACTION_WIDTH = "w-7 shrink-0"
const LEADING_WIDTH = "w-6 shrink-0"

/*
 * Row groups: every list and table. The rows merge into one bordered, rounded
 * block, split by a divider under each row. The last row drops its divider so
 * the block's edge closes it. Headers sit outside, flush with the row text.
 */
export const ROW_GROUP =
  "flex flex-col overflow-hidden rounded-row-group border border-row-group-edge bg-row-group"
// Text starts 10px in, actions sit 6px off the right edge.
export const ROW_INSET = "pl-2.5 pr-1.5"
export const ROW = cn(
  "border-b border-row-group-divider last:border-b-0 hover:bg-row-group-hover",
  ROW_INSET
)
export const ROW_SELECTED = "bg-row-group-selected hover:bg-row-group-selected"
// Headers sit outside the block, so they take its 1px edge on too and line up with row text.
export const HEADER_INSET = "pl-[11px] pr-[7px]"

// A label above a group or a table, flush with the row text.
export function RowGroupHeader({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center justify-between gap-3 text-meta text-muted-foreground tabular-nums",
        HEADER_INSET,
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * A list or table as one row group, with column headers above it.
 *
 * Rows that open something get `hrefFor` (a link stretched over the row) or
 * `onSelect`. To use your router's link (next/link, React Router), pass
 * `renderLink`.
 */
export function DataRows<Row extends { id: string }>({
  columns,
  rows,
  selectedId,
  hrefFor,
  onSelect,
  renderLink,
  labelFor,
  action,
  isActionPinned,
  leading,
}: {
  columns: DataColumn<Row>[]
  rows: Row[]
  selectedId?: string
  hrefFor?: (row: Row) => string
  onSelect?: (row: Row) => void
  renderLink?: (props: {
    href: string
    className: string
    "aria-label": string
    "aria-current"?: "true"
  }) => ReactNode
  labelFor: (row: Row) => string
  action?: (row: Row) => ReactNode
  // Keeps an action visible without hover, e.g. a copied tick.
  isActionPinned?: (row: Row) => boolean
  /** A 24px slot before the first column, above the row's link: a selection checkbox. */
  leading?: (row: Row) => ReactNode
}) {
  const overlay =
    "absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"

  return (
    <div className="@container/rows mx-auto flex w-full max-w-[1200px] flex-col gap-1">
      <div className={cn("flex h-8 items-center gap-4 text-meta text-muted-foreground", HEADER_INSET)}>
        {leading ? <div aria-hidden className={cn("-mr-2", LEADING_WIDTH)} /> : null}
        {columns.map((column) => (
          <div key={column.id} {...cellProps({ ...column, strong: true })}>
            {column.header}
          </div>
        ))}
        {action ? <div aria-hidden className={ACTION_WIDTH} /> : null}
      </div>

      <ul className={ROW_GROUP}>
        {rows.map((row) => {
          const selected = row.id === selectedId
          const linkProps = {
            className: overlay,
            "aria-label": labelFor(row),
            "aria-current": selected ? ("true" as const) : undefined,
          }
          return (
            <li
              key={row.id}
              className={cn(
                "group/row relative flex h-12 items-center gap-4 tabular-nums has-[a:active]:bg-row-group-selected has-[>button:active]:bg-row-group-selected",
                ROW,
                selected && ROW_SELECTED
              )}
              data-selected={selected ? "true" : undefined}
            >
              {/* Stretched over the row so actions can sit above it as real buttons. */}
              {hrefFor ? (
                renderLink ? (
                  renderLink({ href: hrefFor(row), ...linkProps })
                ) : (
                  <a href={hrefFor(row)} {...linkProps} />
                )
              ) : onSelect ? (
                <button type="button" onClick={() => onSelect(row)} {...linkProps} />
              ) : null}
              {leading ? (
                <div className={cn("relative z-10 -mr-2 flex items-center", LEADING_WIDTH)}>{leading(row)}</div>
              ) : null}
              {columns.map((column) => (
                <div key={column.id} {...cellProps(column)}>
                  {column.cell(row)}
                </div>
              ))}
              {action ? (
                <div
                  className={cn(
                    "relative z-10 flex justify-end",
                    ACTION_WIDTH,
                    !isActionPinned?.(row) &&
                      "opacity-0 group-hover/row:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
                  )}
                >
                  {action(row)}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** A 28px icon-only action at the end of a row. Shows on hover or focus, always on touch. */
export function RowAction({
  label,
  href,
  disabled,
  onClick,
  children,
}: {
  label: string
  href?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}) {
  if (href) {
    return (
      <Button variant="ghost" size="icon-row" aria-label={label} asChild>
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      </Button>
    )
  }
  return (
    <Button variant="ghost" size="icon-row" aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  )
}

export function DataRowsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1">
      <div className="h-8" />
      <div className={ROW_GROUP}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn("flex h-12 items-center gap-4 border-b border-row-group-divider last:border-b-0", ROW_INSET)}
          >
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 w-24 shrink-0" />
            <Skeleton className="h-3 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
