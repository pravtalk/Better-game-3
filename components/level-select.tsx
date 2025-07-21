"use client"
import { ModernButton } from "./modern-button"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { ArrowLeft, Lock, Star } from "lucide-react"
import type { GameMode, Level } from "@/app/page"

interface LevelSelectProps {
  mode: GameMode
  completedLevels: number[]
  onSelectLevel: (level: Level) => void
  onBack: () => void
}

export default function LevelSelect({ mode, completedLevels, onSelectLevel, onBack }: LevelSelectProps) {
  // Generate 20 levels with increasing difficulty
  const levels: Level[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    difficulty: i < 7 ? "easy" : i < 14 ? "medium" : "hard",
    targetScore: (i + 1) * 5,
    unlocked: i === 0 || completedLevels.includes(i),
  }))

  const difficultyColors = {
    easy: "from-green-500 to-emerald-500",
    medium: "from-yellow-500 to-orange-500",
    hard: "from-red-500 to-pink-500",
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme={mode.theme} parallax={true} />

      {/* Mobile-optimized scrollable container */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Fixed Header - Mobile optimized */}
          <div className="flex-shrink-0 sticky top-0 z-20 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 sm:p-6 md:p-8">
              <ModernButton
                variant="glass"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-1 sm:gap-2 border border-white/40"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-xs sm:text-sm">Back</span>
              </ModernButton>

              <UICard variant="glass" padding="sm" className="text-center border border-white/40">
                <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-black text-gray-800">{mode.name}</h1>
                <p className="font-sans text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
                  Choose Your Challenge
                </p>
              </UICard>

              <div className="text-2xl sm:text-4xl animate-bounce">{mode.icon}</div>
            </div>
          </div>

          {/* Scrollable Levels Content */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6">
            {/* Enhanced Levels Grid - Mobile optimized */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {levels.map((level) => {
                const isCompleted = completedLevels.includes(level.id)
                const isUnlocked = level.unlocked || completedLevels.includes(level.id - 1)

                return (
                  <div key={level.id} className="relative aspect-square">
                    <ModernButton
                      variant={isCompleted ? "success" : "primary"}
                      size="sm"
                      onClick={() => isUnlocked && onSelectLevel(level)}
                      disabled={!isUnlocked}
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden border-2 border-white/40 ${
                        !isUnlocked ? "opacity-50" : ""
                      } bg-gradient-to-br ${difficultyColors[level.difficulty]}`}
                    >
                      {!isUnlocked ? (
                        <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <>
                          <span className="font-display text-sm sm:text-xl font-black text-white">{level.id}</span>
                          {isCompleted && <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current" />}
                        </>
                      )}
                    </ModernButton>

                    {/* Difficulty Indicator */}
                    <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${difficultyColors[level.difficulty]}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Legend - Mobile optimized */}
            <div className="flex justify-center gap-3 sm:gap-6 mt-8 sm:mt-12">
              <UICard variant="glass" padding="sm" className="border border-white/30">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                  <span className="font-sans text-gray-800 text-xs sm:text-sm font-bold">Easy</span>
                </div>
              </UICard>
              <UICard variant="glass" padding="sm" className="border border-white/30">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
                  <span className="font-sans text-gray-800 text-xs sm:text-sm font-bold">Medium</span>
                </div>
              </UICard>
              <UICard variant="glass" padding="sm" className="border border-white/30">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                  <span className="font-sans text-gray-800 text-xs sm:text-sm font-bold">Hard</span>
                </div>
              </UICard>
            </div>

            {/* Bottom spacing for mobile */}
            <div className="h-4 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
