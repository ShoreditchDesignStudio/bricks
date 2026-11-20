"use client"

import { CheckCircleIcon, InfoIcon, SpinnerGapIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // forcedTheme covers a theme forced on one page, which `theme` alone doesn't report.
  const { forcedTheme, resolvedTheme = "light" } = useTheme()

  return (
    <Sonner
      theme={(forcedTheme ?? resolvedTheme) as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <SpinnerGapIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--toast)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--toast-border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
