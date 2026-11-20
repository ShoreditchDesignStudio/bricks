import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/registry/bricks/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring-control focus-visible:ring-2 focus-visible:ring-ring-control focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Filled variants carry a transparent border so they line up exactly with outline ones.
        default:
          "border border-transparent bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
        // Solid red with white text, in both themes. Only for the action that deletes.
        destructive:
          "border border-transparent bg-destructive-fill text-white hover:bg-destructive-fill-hover active:bg-destructive-fill-pressed",
        outline:
          "border border-input bg-button-outline hover:bg-accent hover:text-accent-foreground active:bg-row-pressed",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-row-pressed active:bg-row-pressed",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-row-pressed",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // One height everywhere: 32px, matching search fields, selects and the
      // segmented control. `default` and `sm` are the same size, so a call site
      // that leaves size out can't come out taller than its neighbours. `lg` is
      // for a lone, full-width sign-in button only. Height is fixed (border-box, every variant
      // carries or skips a 1px border inside it), so outline, filled and asChild
      // links all measure the same. Don't override h-* or py-* at call sites.
      size: {
        default: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // Icon-only buttons match the 32px row they sit in.
        icon: "size-8",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        // A 28px icon inside a 48px row, on a tile, or in the details header,
        // where it's the only kind of button (RowAction, DetailAction).
        "icon-row": "size-7",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
