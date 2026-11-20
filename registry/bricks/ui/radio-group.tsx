"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@/registry/bricks/lib/utils"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-1", className)} {...props} />
}

// The checked dot is a thick ring rather than a nested circle.
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "size-4 shrink-0 rounded-full border border-switch-edge bg-background outline-none transition-[border-width,border-color] duration-100 focus-visible:ring-2 focus-visible:ring-ring-control focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-border disabled:bg-muted data-[state=checked]:border-[5px] data-[state=checked]:border-primary",
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
