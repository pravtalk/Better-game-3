"use client"
import { useState } from "react"
import { ModernButton } from "./modern-button"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { ArrowLeft, Play, Zap } from "lucide-react"
import type { Powerup, PowerupType } from "@/app/page"

interface PowerupSelectProps {
  powerups: Powerup[]
  powerupInventory: Record<PowerupType, number>
  selectedPowerups: PowerupType[]
  onSelectPowerup: (powerupId: PowerupType) => void
  onDeselectPowerup: (powerupId: PowerupType) => void
  onStartGame: () => void
  onBack: () => void
}

export default function PowerupSelect({
  powerups,
  powerupInventory,
  selectedPowerups,
  onSelectPowerup,
  onDeselectPowerup,
  onStartGame,
  onBack,
}: PowerupSelectProps) {
  const availablePowerups = powerups.filter((powerup) => powerupInventory[powerup.id] > 0)
  
  const handlePowerupToggle = (powerupId: PowerupType) => {
    if (selectedPowerups.includes(powerupId)) {
      onDeselectPowerup(powerupId)
    } else {
      onSelectPowerup(powerupId)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme="village" parallax={true} />

      <div className="relative z-10 h-full overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Header */}
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
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-black text-gray-800">
                    Select Powerups
                  </h1>
                </div>
              </UICard>

              <ModernButton
                variant="success"
                size="sm"
                onClick={onStartGame}
                className="flex items-center gap-1 sm:gap-2 border border-white/40"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-xs sm:text-sm">Start</span>
              </ModernButton>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6">
            {availablePowerups.length === 0 ? (
              /* No Powerups Available */
              <div className="flex items-center justify-center h-64">
                <UICard variant="glass" padding="xl" className="text-center border border-white/40 max-w-md">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="font-display text-xl font-black text-gray-800 mb-3">
                    No Powerups Available
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Visit the Powerups Store to buy some powerups first!
                  </p>
                  <ModernButton
                    variant="primary"
                    size="sm"
                    onClick={onBack}
                    className="w-full"
                  >
                    Go to Store
                  </ModernButton>
                </UICard>
              </div>
            ) : (
              /* Powerups Grid */
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {availablePowerups.map((powerup) => {
                    const inventory = powerupInventory[powerup.id]
                    const isSelected = selectedPowerups.includes(powerup.id)
                    const selectedCount = selectedPowerups.filter(id => id === powerup.id).length

                    return (
                      <UICard
                        key={powerup.id}
                        variant={isSelected ? "gradient" : "elevated"}
                        padding="lg"
                        className={`relative transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
                          isSelected ? "border-yellow-400 shadow-glow-yellow" : "border-white/40"
                        } min-h-[180px]`}
                        onClick={() => handlePowerupToggle(powerup.id)}
                      >
                        {/* Inventory Count */}
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{inventory}</span>
                        </div>

                        {/* Selection Badge */}
                        {isSelected && (
                          <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-green-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce">
                            <span className="text-white font-bold text-sm">✓</span>
                          </div>
                        )}

                        {/* Powerup Icon */}
                        <div className="text-center mb-4">
                          <div className={`text-5xl mb-3 ${isSelected ? "animate-bounce" : "animate-float"}`}>
                            {powerup.icon}
                          </div>
                        </div>

                        {/* Powerup Info */}
                        <div className="text-center">
                          <h3 className="font-display text-lg font-black text-gray-800 mb-2">
                            {powerup.name}
                          </h3>
                          <p className="font-sans text-sm text-gray-700 mb-3 leading-relaxed font-medium">
                            {powerup.description}
                          </p>
                          
                          {isSelected && (
                            <UICard variant="glass" padding="sm" className="inline-block border border-green-300">
                              <span className="font-sans text-xs text-green-800 font-bold">
                                SELECTED
                              </span>
                            </UICard>
                          )}
                        </div>
                      </UICard>
                    )
                  })}
                </div>

                {/* Selected Powerups Summary */}
                {selectedPowerups.length > 0 && (
                  <UICard variant="glass" padding="lg" className="border border-yellow-400/60 mb-6">
                    <h3 className="font-display text-lg font-black text-gray-800 mb-3 text-center">
                      Selected for This Run
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedPowerups.map((powerupId, index) => {
                        const powerup = powerups.find(p => p.id === powerupId)
                        return (
                          <div key={`${powerupId}-${index}`} className="flex items-center gap-1 bg-yellow-100 rounded-full px-3 py-1">
                            <span className="text-lg">{powerup?.icon}</span>
                            <span className="text-sm font-bold text-gray-800">{powerup?.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </UICard>
                )}

                {/* Instructions */}
                <UICard variant="glass" padding="lg" className="text-center border border-white/40">
                  <h3 className="font-display text-lg font-black text-gray-800 mb-3">
                    Instructions
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Tap powerups to select them for this run</p>
                    <p>• You can select multiple powerups</p>
                    <p>• Selected powerups will be consumed when you start playing</p>
                    <p>• Unused powerups remain in your inventory</p>
                  </div>
                </UICard>
              </div>
            )}

            {/* Bottom spacing */}
            <div className="h-4 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}