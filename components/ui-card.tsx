import type React from "react"
import { cn } from "@/lib/utils"

interface UICardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "glass" | "gradient" | "elevated"
  padding?: "sm" | "md" | "lg" | "xl"
}

export function UICard({ children, className, variant = "default", padding = "md" }: UICardProps) {
  const baseClasses = "rounded-3xl border-2 transition-all duration-300"

  const variants = {
    default:
      "bg-gradient-to-br from-ui-card to-ui-card-light border-ui-border shadow-ui-card hover:shadow-ui-card-hover",
    glass:
      "bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-md border-white/30 shadow-ui-card hover:shadow-ui-card-hover",
    gradient: "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-ui-card hover:shadow-ui-card-hover",
    elevated:
      "bg-gradient-to-br from-white to-ui-card-light border-ui-border-light shadow-ui-card-hover hover:shadow-xl",
  }

  const paddings = {
    sm: "p-2 sm:p-4",
    md: "p-3 sm:p-6",
    lg: "p-4 sm:p-8",
    xl: "p-6 sm:p-10",
  }

  return <div className={cn(baseClasses, variants[variant], paddings[padding], className)}>{children}</div>
}
