"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/registry/bricks/lib/utils"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { toggleVariants } from "@/registry/bricks/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
})

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        // One segmented control everywhere: a 32px track (matching sm buttons and
        // selects) with 4px of air around 24px thumbs. The edge is an inset shadow,
        // so it adds no height.
        "group/toggle-group inline-flex w-fit items-center gap-1 rounded-md bg-segment-track p-1 shadow-[inset_0_0_0_1px_var(--color-segment-track-edge)]",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // Size is fixed here rather than per call site. Icon-only items go square.
        "h-6 min-w-6 shrink-0 px-4 transition-[color,background-color,box-shadow] focus:z-10 focus-visible:z-10 data-[state=on]:shadow-segment-thumb data-[state=on]:hover:bg-segment-thumb has-[>svg:only-child]:w-8 has-[>svg:only-child]:px-0",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
