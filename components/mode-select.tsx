"use client"
import { ModernButton } from "./modern-button"
import { BouncingCoin } from "./bouncing-coin"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { ArrowLeft } from "lucide-react"
import type { GameMode } from "@/app/page"

interface ModeSelectProps {
  modes: GameMode[]
  selectedMode: GameMode
  unlockedModes: string[]
  totalCoins: number
  onSelectMode: (mode: GameMode) => void
  onUnlockMode: (modeId: string) => void
  onBack: () => void
}

export default function ModeSelect({
  modes,
  selectedMode,
  unlockedModes,
  totalCoins,
  onSelectMode,
  onUnlockMode,
  onBack,
}: ModeSelectProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme="village" parallax={true} />

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

              <UICard variant="glass" padding="sm" className="border border-white/40">
                <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-black text-gray-800">Game Modes</h1>
              </UICard>

              <UICard variant="glass" padding="sm" className="border border-white/40">
                <BouncingCoin count={totalCoins} size="sm" animate={false} />
              </UICard>
            </div>
          </div>

          {/* Scrollable Modes Content */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6">
            {/* Enhanced Modes List - Mobile optimized */}
            <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
              {modes.map((mode, index) => {
                const isUnlocked = unlockedModes.includes(mode.id)

                return (
                  <UICard
                    key={mode.id}
                    variant="glass"
                    padding="md"
                    className={`transition-all duration-300 border-2 border-white/40 ${
                      isUnlocked ? "hover:border-white/60 cursor-pointer hover:scale-105" : "opacity-75"
                    }`}
                    onClick={() => isUnlocked && onSelectMode(mode)}
                  >
                    <div className="flex items-center gap-3 sm:gap-6">
                      {/* Mode Icon */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="text-4xl sm:text-6xl animate-bounce"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          {mode.icon}
                        </div>
                      </div>

                      {/* Mode Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg sm:text-2xl font-black text-gray-800 mb-1 sm:mb-2">
                          {mode.name}
                        </h3>
                        <p className="font-sans text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 font-medium leading-relaxed">
                          {mode.description}
                        </p>

                        {/* Theme Badge */}
                        <UICard variant="glass" padding="sm" className="inline-block border border-white/30">
                          <span className="font-sans text-xs text-gray-800 uppercase tracking-wide font-bold">
                            {mode.theme} theme
                          </span>
                        </UICard>
                      </div>

                      {/* Action */}
                      <div className="text-center flex-shrink-0">
                        <ModernButton
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectMode(mode)
                          }}
                          className="font-bold"
                        >
                          Play
                        </ModernButton>
                      </div>
                    </div>
                  </UICard>
                )
              })}
            </div>

            {/* Bottom spacing for mobile */}
            <div className="h-4 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
