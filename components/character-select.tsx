"use client"
import { ModernButton } from "./modern-button"
import { BouncingCoin } from "./bouncing-coin"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { AnimatedCharacter } from "./animated-character"
import { ArrowLeft, Lock, Crown } from "lucide-react"
import type { Character } from "@/app/page"

interface CharacterSelectProps {
  characters: Character[]
  selectedCharacter: Character
  unlockedCharacters: string[]
  totalCoins: number
  onSelectCharacter: (character: Character) => void
  onUnlockCharacter: (characterId: string) => void
  onBack: () => void
}

export default function CharacterSelect({
  characters,
  selectedCharacter,
  unlockedCharacters,
  totalCoins,
  onSelectCharacter,
  onUnlockCharacter,
  onBack,
}: CharacterSelectProps) {
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
                <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-black text-gray-800">
                  Choose Character
                </h1>
              </UICard>

              <UICard variant="glass" padding="sm" className="border border-white/40">
                <BouncingCoin count={totalCoins} size="sm" animate={false} />
              </UICard>
            </div>
          </div>

          {/* Scrollable Characters Content */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6">
            {/* Mobile-optimized Characters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {characters.map((character) => {
                const isUnlocked = unlockedCharacters.includes(character.id)
                const isSelected = selectedCharacter.id === character.id
                const canAfford = totalCoins >= character.unlockCost

                return (
                  <UICard
                    key={character.id}
                    variant={isSelected ? "gradient" : isUnlocked ? "elevated" : "default"}
                    padding="md"
                    className={`relative transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
                      isSelected ? "border-yellow-400 shadow-glow-yellow" : "border-white/40"
                    } ${!isUnlocked ? "opacity-75" : ""} min-h-[280px] sm:min-h-[320px]`}
                    onClick={() => isUnlocked && onSelectCharacter(character)}
                  >
                    {/* Selection Crown */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 sm:p-3 shadow-lg animate-bounce">
                        <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}

                    {/* Lock Overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-gray-600 rounded-full p-3 sm:p-4 shadow-lg">
                          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Character Display */}
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="relative inline-block mb-3 sm:mb-4">
                        <AnimatedCharacter
                          character={character}
                          size="md"
                          animation={isSelected ? "bounce" : "float"}
                          showSparkles={isSelected}
                        />
                      </div>
                    </div>

                    {/* Character Info */}
                    <div className="text-center mb-4 sm:mb-6 flex-1">
                      <h3 className="font-display text-lg sm:text-xl font-black text-gray-800 mb-2">
                        {character.name}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed font-medium px-1">
                        {character.description}
                      </p>

                      {/* Enhanced Ability Badge */}
                      <UICard variant="glass" padding="sm" className="inline-block border border-white/30">
                        <span className="font-sans text-xs text-gray-800 uppercase tracking-wide font-bold">
                          {character.ability.replace("-", " ")}
                        </span>
                      </UICard>
                    </div>

                    {/* Enhanced Action Button */}
                    <div className="text-center mt-auto">
                      {isUnlocked ? (
                        <ModernButton
                          variant={isSelected ? "success" : "primary"}
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation()
                            onSelectCharacter(character)
                          }}
                          className="w-full"
                        >
                          {isSelected ? (
                            <span className="flex items-center justify-center gap-1 sm:gap-2">
                              <span>✓</span>
                              <span className="font-bold text-xs sm:text-sm">Selected</span>
                            </span>
                          ) : (
                            <span className="font-bold text-xs sm:text-sm">Select</span>
                          )}
                        </ModernButton>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          <UICard variant="glass" padding="sm" className="border border-white/30">
                            <BouncingCoin count={character.unlockCost} size="sm" animate={false} />
                          </UICard>
                          {canAfford && (
                            <ModernButton
                              variant="warning"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation()
                                onUnlockCharacter(character.id)
                              }}
                              className="w-full"
                            >
                              <span className="font-bold text-xs sm:text-sm">Unlock</span>
                            </ModernButton>
                          )}
                        </div>
                      )}
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
