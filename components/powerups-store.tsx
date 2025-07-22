"use client"
import { useState } from "react"
import { ModernButton } from "./modern-button"
import { BouncingCoin } from "./bouncing-coin"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { ArrowLeft, ShoppingCart, Check, X } from "lucide-react"
import type { Powerup, PowerupType } from "@/app/page"

interface PowerupsStoreProps {
  powerups: Powerup[]
  powerupInventory: Record<PowerupType, number>
  totalCoins: number
  onBuyPowerup: (powerupId: PowerupType) => boolean
  onBack: () => void
}

export default function PowerupsStore({
  powerups,
  powerupInventory,
  totalCoins,
  onBuyPowerup,
  onBack,
}: PowerupsStoreProps) {
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)

  const handlePurchase = (powerupId: PowerupType) => {
    const powerup = powerups.find((p) => p.id === powerupId)
    if (!powerup) return

    if (totalCoins >= powerup.price) {
      const success = onBuyPowerup(powerupId)
      if (success) {
        setPurchaseSuccess(`${powerup.name} purchased!`)
        // Play success sound effect
        playSuccessSound()
        setTimeout(() => setPurchaseSuccess(null), 2000)
      }
    } else {
      setPurchaseError("Not enough coins!")
      setTimeout(() => setPurchaseError(null), 2000)
    }
  }

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("Audio not available")
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme="village" parallax={true} />

      {/* Success/Error Messages */}
      {purchaseSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <UICard variant="gradient" padding="md" className="border-2 border-green-400 shadow-glow-yellow">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800">{purchaseSuccess}</span>
            </div>
          </UICard>
        </div>
      )}

      {purchaseError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
          <UICard variant="elevated" padding="md" className="border-2 border-red-400">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-800">{purchaseError}</span>
            </div>
          </UICard>
        </div>
      )}

      {/* Mobile-optimized scrollable container */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Fixed Header */}
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
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-black text-gray-800">
                    Powerups Store
                  </h1>
                </div>
              </UICard>

              <UICard variant="glass" padding="sm" className="border border-white/40">
                <BouncingCoin count={totalCoins} size="sm" animate={false} />
              </UICard>
            </div>
          </div>

          {/* Powerups Grid */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {powerups.map((powerup) => {
                const canAfford = totalCoins >= powerup.price
                const inventory = powerupInventory[powerup.id]

                return (
                  <UICard
                    key={powerup.id}
                    variant="elevated"
                    padding="lg"
                    className={`relative transition-all duration-300 hover:scale-105 border-2 ${
                      canAfford ? "border-green-400/60 hover:border-green-400" : "border-white/40"
                    } min-h-[200px] sm:min-h-[240px]`}
                  >
                    {/* Inventory Count Badge */}
                    {inventory > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{inventory}</span>
                      </div>
                    )}

                    {/* Powerup Icon */}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3 animate-float">{powerup.icon}</div>
                    </div>

                    {/* Powerup Info */}
                    <div className="text-center mb-4 flex-1">
                      <h3 className="font-display text-xl font-black text-gray-800 mb-2">
                        {powerup.name}
                      </h3>
                      <p className="font-sans text-sm text-gray-700 mb-3 leading-relaxed font-medium">
                        {powerup.description}
                      </p>
                      <UICard variant="glass" padding="sm" className="inline-block border border-white/30 mb-3">
                        <span className="font-sans text-xs text-gray-700 font-bold">
                          {powerup.effect}
                        </span>
                      </UICard>
                    </div>

                    {/* Price and Buy Button */}
                    <div className="text-center space-y-3">
                      <UICard variant="glass" padding="sm" className="border border-white/30">
                        <BouncingCoin count={powerup.price} size="sm" animate={false} />
                      </UICard>

                      <ModernButton
                        variant={canAfford ? "primary" : "light"}
                        size="sm"
                        onClick={() => handlePurchase(powerup.id)}
                        disabled={!canAfford}
                        className="w-full"
                      >
                        <span className="font-bold text-sm">
                          {canAfford ? "Buy Powerup" : "Need More Coins"}
                        </span>
                      </ModernButton>
                    </div>
                  </UICard>
                )
              })}
            </div>

            {/* Instructions */}
            <div className="mt-8 max-w-2xl mx-auto">
              <UICard variant="glass" padding="lg" className="text-center border border-white/40">
                <h3 className="font-display text-lg font-black text-gray-800 mb-3">
                  How Powerups Work
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Buy powerups here using your coins</p>
                  <p>• Before each game, select which powerups to use</p>
                  <p>• Powerups are consumed only when you start playing</p>
                  <p>• You can buy multiple of the same powerup</p>
                </div>
              </UICard>
            </div>

            {/* Bottom spacing */}
            <div className="h-4 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}