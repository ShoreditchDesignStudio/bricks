import { Fragment, type ReactNode } from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/bricks/ui/breadcrumb"
import { Input } from "@/registry/bricks/ui/input"
import { Separator } from "@/registry/bricks/ui/separator"
import { cn } from "@/registry/bricks/lib/utils"

export type Crumb = { label: string; href: string }

/**
 * Every page owns one: an optional leading control (a sidebar trigger), the
 * breadcrumb, the title in the display face, an optional byline, and the
 * page's controls on the right with the primary last.
 *
 * Crumbs are plain links; pass `renderLink` to use your router's link.
 */
export function PageHeader({
  crumbs = [],
  title,
  titleSlot,
  byline,
  controls,
  leading,
  renderLink,
}: {
  crumbs?: Crumb[]
  title: string
  /** Replaces the title text inside the h1, e.g. for click-to-rename. */
  titleSlot?: ReactNode
  byline?: string
  controls?: ReactNode
  /** A 28px control before the breadcrumb, such as a sidebar trigger. */
  leading?: ReactNode
  renderLink?: (crumb: Crumb) => ReactNode
}) {
  return (
    <header className="shrink-0 border-b px-4">
      {crumbs.length || leading ? (
        /* Roughly 20px of air above the breadcrumb, above the title and below it. */
        <div className="mt-3 flex h-7 items-center gap-1.5">
          {leading ? (
            <>
              <div className="-ml-1.5 flex">{leading}</div>
              <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
            </>
          ) : null}
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="gap-1 text-meta sm:gap-1 [&_svg]:size-3">
              {crumbs.map((crumb, index) => (
                <Fragment key={crumb.href}>
                  {index > 0 ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {index === crumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        {renderLink ? renderLink(crumb) : <a href={crumb.href}>{crumb.label}</a>}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ) : null}
      <div className="mt-3 flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-5">
        <div className="flex min-w-0 flex-1 items-baseline gap-2.5">
          {/* An editable title brings its own box, which bleeds past the text, so it isn't clipped. */}
          <h1 className={cn("min-w-0 font-display text-page-title", !titleSlot && "truncate")}>
            {titleSlot ?? title}
          </h1>
          {byline ? (
            <span className="shrink-0 text-eyebrow text-muted-foreground uppercase">By {byline}</span>
          ) : null}
        </div>
        {controls ? <div className="flex flex-wrap items-center gap-2">{controls}</div> : null}
      </div>
    </header>
  )
}

/** The header's search field: 32px high, 256px wide from `sm`. */
export function PageSearch({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  disabled?: boolean
}) {
  return (
    <div className="relative w-full sm:w-64">
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-8 pl-8"
      />
    </div>
  )
}
