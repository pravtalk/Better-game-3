"use client"

import { useEffect, useState } from "react"

interface VillageBackgroundProps {
  theme: "village" | "forest" | "sunset" | "mountain"
  parallax?: boolean
}

export default function VillageBackground({ theme, parallax = true }: VillageBackgroundProps) {
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    if (!parallax) return

    const interval = setInterval(() => {
      setScrollOffset((prev) => (prev + 0.5) % 2000)
    }, 50)
    return () => clearInterval(interval)
  }, [parallax])

  const getThemeElements = () => {
    switch (theme) {
      case "village":
        return (
          <>
            {/* Sky Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200" />

            {/* Clouds - Far Layer */}
            <div className="absolute inset-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`cloud-far-${i}`}
                  className="absolute text-white text-6xl opacity-80"
                  style={{
                    left: `${(i * 300 - scrollOffset * 0.1) % 120}%`,
                    top: `${10 + i * 5}%`,
                    transform: `scale(${0.8 + (i % 3) * 0.2})`,
                  }}
                >
                  ☁️
                </div>
              ))}
            </div>

            {/* Hills - Background */}
            <div className="absolute bottom-0 w-full">
              <svg viewBox="0 0 1200 300" className="w-full h-48">
                <path
                  d="M0,300 Q200,150 400,200 T800,180 Q1000,160 1200,200 L1200,300 Z"
                  fill="#8FBC8F"
                  opacity="0.7"
                />
                <path d="M0,300 Q150,180 350,220 T750,200 Q950,180 1200,220 L1200,300 Z" fill="#9ACD32" opacity="0.8" />
              </svg>
            </div>

            {/* Trees - Mid Layer */}
            <div className="absolute bottom-16 w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`tree-${i}`}
                  className="absolute text-6xl"
                  style={{
                    left: `${(i * 150 - scrollOffset * 0.3) % 120}%`,
                    bottom: `${Math.random() * 20}px`,
                    transform: `scale(${0.8 + Math.random() * 0.4})`,
                  }}
                >
                  🌳
                </div>
              ))}
            </div>

            {/* Houses - Village */}
            <div className="absolute bottom-20 w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`house-${i}`}
                  className="absolute text-5xl"
                  style={{
                    left: `${(i * 200 - scrollOffset * 0.4) % 120}%`,
                    bottom: `${Math.random() * 10}px`,
                  }}
                >
                  {["🏠", "🏡", "🏘️", "🏰", "⛪"][i % 5]}
                </div>
              ))}
            </div>

            {/* Ground/Soil */}
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20" />
              {/* Grass texture */}
              <div className="absolute top-0 w-full h-2 bg-green-500 opacity-80" />
            </div>

            {/* Flying elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`bird-${i}`}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    left: `${(i * 250 - scrollOffset * 0.6) % 120}%`,
                    top: `${20 + i * 15}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  🕊️
                </div>
              ))}
            </div>
          </>
        )

      case "forest":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-green-300 to-emerald-200" />

            {/* Dense forest background */}
            <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-green-800 via-green-700 to-green-600 opacity-80" />

            {/* Forest trees */}
            <div className="absolute bottom-16 w-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`forest-tree-${i}`}
                  className="absolute text-7xl"
                  style={{
                    left: `${(i * 100 - scrollOffset * 0.3) % 120}%`,
                    bottom: `${Math.random() * 30}px`,
                    transform: `scale(${0.6 + Math.random() * 0.6})`,
                  }}
                >
                  {["🌲", "🌳", "🎄"][i % 3]}
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700" />
          </>
        )

      case "sunset":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-pink-400 to-purple-500" />

            {/* City silhouette */}
            <div className="absolute bottom-16 w-full">
              <svg viewBox="0 0 1200 200" className="w-full h-32">
                {Array.from({ length: 15 }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 80}
                    y={Math.random() * 100 + 50}
                    width={60}
                    height={150 - Math.random() * 50}
                    fill="#1a1a2e"
                    opacity="0.8"
                  />
                ))}
              </svg>
            </div>

            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600" />
          </>
        )

      case "mountain":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-slate-200" />

            {/* Mountain peaks */}
            <div className="absolute bottom-0 w-full">
              <svg viewBox="0 0 1200 400" className="w-full h-64">
                <polygon points="0,400 200,100 400,200 600,50 800,150 1000,80 1200,120 1200,400" fill="#8B7355" />
                <polygon points="0,400 150,180 350,250 550,120 750,200 950,140 1200,160 1200,400" fill="#A0522D" />
              </svg>
            </div>

            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-stone-800 via-stone-700 to-stone-600" />
          </>
        )

      default:
        return <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200" />
    }
  }

  return <div className="absolute inset-0 overflow-hidden">{getThemeElements()}</div>
}
