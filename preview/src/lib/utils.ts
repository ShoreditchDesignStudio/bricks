import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register Bricks' type tokens as font sizes. Without this, tailwind-merge
// reads text-ui as a text colour and drops it next to text-muted-foreground.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["page-title", "panel-title", "section", "body", "ui", "meta", "eyebrow", "display-panel", "display-section", "display-number"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
