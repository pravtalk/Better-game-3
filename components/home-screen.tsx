"use client"
import { ModernButton } from "./modern-button"
import { BouncingCoin } from "./bouncing-coin"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { AnimatedCharacter } from "./animated-character"
import { AnimatedScore } from "./animated-score"
import type { Character } from "@/app/page"

interface HomeScreenProps {
  onStartGame: () => void
  onSelectCharacter: () => void
  onHowToPlay: () => void
  selectedCharacter: Character
  highScore: number
  totalCoins: number
}

export default function HomeScreen({
  onStartGame,
  onSelectCharacter,
  onHowToPlay,
  selectedCharacter,
  highScore,
  totalCoins,
}: HomeScreenProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme="village" parallax={true} />

      {/* Mobile-optimized scrollable container */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="min-h-full flex flex-col p-4 sm:p-6 md:p-8">
          {/* Title Section - Compact for mobile */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 flex-shrink-0">
            <div className="relative inline-block mb-3 sm:mb-4">
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl animate-soft-glow">
                TOPPER
              </h1>
              <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                WINGS
              </h2>
              {/* Glow effect behind title */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 blur-3xl -z-10 animate-pulse" />
            </div>

            <UICard variant="glass" padding="sm" className="max-w-xs sm:max-w-md mx-auto">
              <p className="font-sans text-sm sm:text-lg md:text-xl text-gray-800 font-semibold drop-shadow-sm">
                Soar through the peaceful village skies! 🏘️
              </p>
            </UICard>
          </div>

          {/* Stats Cards - Mobile friendly layout */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
            <UICard variant="elevated" padding="sm" className="min-w-[100px] sm:min-w-[120px] shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <span className="text-lg sm:text-2xl mr-1 sm:mr-2">🏆</span>
                  <span className="font-sans text-gray-700 text-xs sm:text-sm font-bold">High Score</span>
                </div>
                <AnimatedScore score={highScore} className="text-lg sm:text-2xl text-gray-800" />
              </div>
            </UICard>

            <UICard variant="elevated" padding="sm" className="min-w-[100px] sm:min-w-[120px] shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <BouncingCoin count={totalCoins} size="sm" animate={true} />
                </div>
              </div>
            </UICard>
          </div>

          {/* Character Display - Optimized for mobile */}
          <div className="flex-1 flex flex-col justify-center mb-4 sm:mb-6">
            <UICard
              variant="glass"
              padding="md"
              className="relative overflow-hidden shadow-2xl border-2 border-white/40 max-w-sm mx-auto w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10" />
              <div className="relative text-center">
                {/* Character Name Above Emoji */}
                <h3 className="font-display text-xl sm:text-2xl font-black text-gray-800 mb-3 sm:mb-4 drop-shadow-md">
                  {selectedCharacter.name}
                </h3>

                <div className="mb-3 sm:mb-4">
                  <AnimatedCharacter character={selectedCharacter} size="lg" animation="float" showSparkles={true} />
                </div>

                <p className="font-sans text-xs sm:text-sm text-gray-700 font-medium leading-relaxed px-2">
                  {selectedCharacter.description}
                </p>
              </div>
            </UICard>
          </div>

          {/* Action Buttons - Mobile optimized */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm mx-auto flex-shrink-0">
            <ModernButton variant="primary" size="lg" onClick={onStartGame} className="w-full shadow-glow-yellow">
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">🚀</span>
                <span className="font-black text-sm sm:text-base">START GAME</span>
              </span>
            </ModernButton>

            <ModernButton variant="secondary" size="md" onClick={onSelectCharacter} className="w-full">
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl">👤</span>
                <span className="font-bold text-sm sm:text-base">CHARACTERS</span>
              </span>
            </ModernButton>

            <ModernButton variant="glass" size="md" onClick={onHowToPlay} className="w-full">
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl">❓</span>
                <span className="font-bold text-sm sm:text-base">HOW TO PLAY</span>
              </span>
            </ModernButton>
          </div>

          {/* Footer - Mobile friendly */}
          <div className="mt-6 sm:mt-8 pb-4 sm:pb-6 flex-shrink-0">
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              {/* Small Logo Icon */}
              <div className="text-2xl sm:text-3xl animate-bounce">🎮</div>

              {/* Footer Card */}
              <UICard variant="glass" padding="sm" className="shadow-lg border border-white/30">
                <p className="font-sans text-gray-800 text-xs sm:text-sm font-semibold text-center">
                  Made with <span className="text-red-500 animate-pulse text-sm sm:text-lg">❤️</span> by Topper Wings
                  Team
                </p>
              </UICard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
