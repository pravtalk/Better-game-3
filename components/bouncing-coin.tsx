"use client"

import { useEffect, useState } from "react"
import { Coins } from "lucide-react"

interface BouncingCoinProps {
  count: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  animate?: boolean
}

export function BouncingCoin({ count, size = "md", showCount = true, animate = true }: BouncingCoinProps) {
  const [prevCount, setPrevCount] = useState(count)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (count > prevCount && animate) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      setPrevCount(count)
      return () => clearTimeout(timer)
    }
    setPrevCount(count)
  }, [count, prevCount, animate])

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

  return (
    <div className="flex items-center gap-2 relative">
      <div className={`relative ${isAnimating ? "animate-bounce" : ""}`}>
        <Coins className={`${sizes[size]} text-yellow-500 animate-spin drop-shadow-lg`} />
        <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-pulse" />
        {isAnimating && (
          <>
            <div className="absolute -top-2 -right-2 text-yellow-400 animate-ping">✨</div>
            <div className="absolute -bottom-2 -left-2 text-yellow-400 animate-ping" style={{ animationDelay: "0.2s" }}>
              ⭐
            </div>
          </>
        )}
      </div>
      {showCount && (
        <span
          className={`${textSizes[size]} font-display font-black text-yellow-600 drop-shadow-md ${isAnimating ? "animate-pulse text-yellow-400" : ""}`}
        >
          {count.toLocaleString()}
        </span>
      )}
    </div>
  )
}
