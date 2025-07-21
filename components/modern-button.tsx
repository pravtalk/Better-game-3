import type React from "react"
import { cn } from "@/lib/utils"

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "glass" | "light"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

export function ModernButton({ variant = "primary", size = "md", className, children, ...props }: ModernButtonProps) {
  const baseClasses =
    "font-display font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 focus:outline-none focus:ring-4 focus:ring-opacity-50"

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-purple-500 shadow-ui-button hover:shadow-ui-button-hover focus:ring-purple-300",
    secondary:
      "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-blue-500 shadow-ui-button hover:shadow-ui-button-hover focus:ring-blue-300",
    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-500 shadow-ui-button hover:shadow-ui-button-hover focus:ring-green-300",
    warning:
      "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-yellow-400 shadow-ui-button hover:shadow-ui-button-hover focus:ring-yellow-300",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-red-500 shadow-ui-button hover:shadow-ui-button-hover focus:ring-red-300",
    glass:
      "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md border-white/40 hover:bg-white/40 text-ui-text-primary shadow-ui-card hover:shadow-ui-card-hover focus:ring-white/30",
    light:
      "bg-gradient-to-r from-ui-card to-ui-card-light hover:from-white hover:to-ui-card border-ui-border text-ui-text-primary shadow-ui-card hover:shadow-ui-card-hover focus:ring-gray-200",
  }

  const sizes = {
    sm: "px-3 py-2 text-xs min-h-[2rem] sm:px-4 sm:py-2 sm:text-sm sm:min-h-[2.5rem]",
    md: "px-4 py-2 text-sm min-h-[2.5rem] sm:px-6 sm:py-3 sm:text-base sm:min-h-[3rem]",
    lg: "px-5 py-3 text-base min-h-[3rem] sm:px-8 sm:py-4 sm:text-lg sm:min-h-[3.5rem]",
    xl: "px-6 py-3 text-lg min-h-[3.5rem] sm:px-10 sm:py-5 sm:text-xl sm:min-h-[4rem]",
  }

  return (
    <button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
