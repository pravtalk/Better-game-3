import { Coins } from "lucide-react"

interface AnimatedCoinProps {
  count: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  variant?: "default" | "glow"
}

export function AnimatedCoin({ count, size = "md", showCount = true, variant = "default" }: AnimatedCoinProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  const glowClass = variant === "glow" ? "animate-glow" : ""

  return (
    <div className={`flex items-center gap-2 ${glowClass}`}>
      <div className="relative">
        <Coins className={cn(sizes[size], "text-yellow-500 animate-spin drop-shadow-lg")} />
        <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-pulse" />
        {variant === "glow" && <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm animate-pulse" />}
      </div>
      {showCount && (
        <span
          className={cn(
            textSizes[size],
            "font-display font-black text-yellow-600 drop-shadow-md",
            variant === "glow" ? "text-shadow-glow" : "",
          )}
        >
          {count.toLocaleString()}
        </span>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ")
}
