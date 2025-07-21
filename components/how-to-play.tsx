"use client"
import { ModernButton } from "./modern-button"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { ArrowLeft, MousePointer, Coins, Target, Trophy } from "lucide-react"

interface HowToPlayProps {
  onBack: () => void
}

export default function HowToPlay({ onBack }: HowToPlayProps) {
  const instructions = [
    {
      icon: <MousePointer className="w-8 h-8" />,
      title: "Tap to Fly",
      description: "Tap anywhere on the screen to make your character flap and fly upward through the village",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Avoid Obstacles",
      description: "Navigate through gaps between wooden pipes that grow from the village soil",
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Collect Coins",
      description: "Gather sparkling coins to unlock new characters and abilities",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Complete Levels",
      description: "Reach the target score to complete levels and unlock new village areas",
    },
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme="village" parallax={true} />

      <div className="relative z-10 p-6 md:p-8 h-full">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <ModernButton
            variant="glass"
            size="md"
            onClick={onBack}
            className="flex items-center gap-2 border border-white/40"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back</span>
          </ModernButton>
          <UICard variant="glass" padding="sm" className="border border-white/40">
            <h1 className="font-display text-3xl md:text-4xl font-black text-gray-800">How to Play</h1>
          </UICard>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Enhanced Instructions */}
        <div className="max-w-2xl mx-auto space-y-6">
          {instructions.map((instruction, index) => (
            <UICard
              key={index}
              variant="glass"
              padding="lg"
              className="border-2 border-white/40 hover:border-white/60 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 text-white shadow-lg">
                  {instruction.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl font-black text-gray-800 mb-2">{instruction.title}</h3>
                  <p className="font-sans text-gray-700 font-medium">{instruction.description}</p>
                </div>
              </div>
            </UICard>
          ))}
        </div>

        {/* Enhanced Character Abilities Section */}
        <div className="max-w-2xl mx-auto mt-8">
          <UICard variant="glass" padding="sm" className="text-center mb-6 border border-white/40">
            <h2 className="font-display text-2xl font-black text-gray-800">Character Abilities</h2>
          </UICard>

          <UICard variant="glass" padding="lg" className="border-2 border-white/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-gray-700">
                <strong className="text-gray-800 font-bold">Extra Lives:</strong> Start with 3 hearts
              </div>
              <div className="text-gray-700">
                <strong className="text-gray-800 font-bold">Invisibility:</strong> Go invisible for 3 seconds
              </div>
              <div className="text-gray-700">
                <strong className="text-gray-800 font-bold">Slow Gravity:</strong> Slower falling speed
              </div>
              <div className="text-gray-700">
                <strong className="text-gray-800 font-bold">Small Hitbox:</strong> Easier to pass through gaps
              </div>
              <div className="text-gray-700">
                <strong className="text-gray-800 font-bold">Fast Flap:</strong> Quicker response time
              </div>
              <div className="text-gray-700">
                <strong className="text-gray-800 font-bold">Bonus Points:</strong> Extra points every 5 pipes
              </div>
            </div>
          </UICard>
        </div>

        {/* Enhanced Tips */}
        <div className="max-w-2xl mx-auto mt-8">
          <UICard variant="gradient" padding="lg" className="border-2 border-yellow-400/50">
            <h3 className="font-display text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Pro Tips
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm font-medium">
              <li>• Practice timing your taps for smooth flight through the village</li>
              <li>• Collect coins to unlock powerful characters with special abilities</li>
              <li>• Each game mode offers unique village themes and challenges</li>
              <li>• Complete levels to unlock harder difficulties and new areas</li>
              <li>• Characters are now very affordable - only 5-10 coins each!</li>
            </ul>
          </UICard>
        </div>
      </div>
    </div>
  )
}
