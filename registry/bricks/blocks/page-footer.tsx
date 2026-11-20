import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr"
import { Button } from "@/registry/bricks/ui/button"

// The counterpart to PageHeader: 40px, pinned under the content, pagination only.
export function PageFooter({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <footer className="flex h-10 shrink-0 items-center justify-between border-t px-2">
      <Button variant="ghost" size="sm" disabled={page === 0} onClick={onPrevious}>
        <CaretLeftIcon aria-hidden />
        Previous
      </Button>
      <span className="text-meta text-muted-foreground tabular-nums" aria-live="polite">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={onNext}
      >
        Next
        <CaretRightIcon aria-hidden />
      </Button>
    </footer>
  )
}
