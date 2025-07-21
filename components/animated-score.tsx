"use client"

import { useEffect, useState } from "react"

interface AnimatedScoreProps {
  score: number
  className?: string
}

export function AnimatedScore({ score, className = "" }: AnimatedScoreProps) {
  const [displayScore, setDisplayScore] = useState(score)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setDisplayScore(score)
        setIsAnimating(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [score, displayScore])

  return (
    <div className={`relative ${className}`}>
      <span
        className={`font-display font-black transition-all duration-200 ${
          isAnimating ? "scale-125 text-yellow-400" : "scale-100"
        }`}
      >
        {displayScore}
      </span>
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-yellow-400 animate-ping">✨</span>
        </div>
      )}
    </div>
  )
}
