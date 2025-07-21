"use client"
import { ModernButton } from "./modern-button"
import VillageBackground from "./village-background"
import { UICard } from "./ui-card"
import { ArrowLeft, Zap, Shield, Flame } from "lucide-react"
import { difficultyModes, type DifficultyMode } from "./game-physics"

interface DifficultySelectProps {
  onSelectDifficulty: (difficulty: DifficultyMode) => void
  onBack: () => void
}

export default function DifficultySelect({ onSelectDifficulty, onBack }: DifficultySelectProps) {
  const getDifficultyIcon = (id: string) => {
    switch (id) {
      case "easy":
        return <Shield className="w-8 h-8" />
      case "medium":
        return <Zap className="w-8 h-8" />
      case "hard":
        return <Flame className="w-8 h-8" />
      default:
        return <Zap className="w-8 h-8" />
    }
  }

  const getDifficultyColor = (id: string) => {
    switch (id) {
      case "easy":
        return "from-green-500 to-emerald-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "hard":
        return "from-red-500 to-pink-500"
      default:
        return "from-blue-500 to-purple-500"
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
                <h1 className="font-display text-lg sm:text-2xl md:text-4xl font-black text-gray-800">
                  Choose Difficulty
                </h1>
              </UICard>
              <div className="w-16 sm:w-20" /> {/* Spacer */}
            </div>
          </div>

          {/* Difficulty Options */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6">
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              {difficultyModes.map((difficulty, index) => (
                <UICard
                  key={difficulty.id}
                  variant="glass"
                  padding="lg"
                  className="transition-all duration-300 border-2 border-white/40 hover:border-white/60 cursor-pointer hover:scale-105"
                  onClick={() => onSelectDifficulty(difficulty)}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Difficulty Icon */}
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${getDifficultyColor(
                        difficulty.id,
                      )} text-white shadow-lg animate-bounce`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {getDifficultyIcon(difficulty.id)}
                    </div>

                    {/* Difficulty Info */}
                    <div className="flex-1">
                      <h3 className="font-display text-xl sm:text-2xl font-black text-gray-800 mb-2">
                        {difficulty.name}
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-gray-700 mb-4 font-medium leading-relaxed">
                        {difficulty.description}
                      </p>

                      {/* Physics Stats */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <UICard variant="glass" padding="sm" className="border border-white/30">
                          <div className="text-center">
                            <div className="font-bold text-gray-800">Gravity</div>
                            <div className="text-gray-600">{difficulty.physics.gravity}</div>
                          </div>
                        </UICard>
                        <UICard variant="glass" padding="sm" className="border border-white/30">
                          <div className="text-center">
                            <div className="font-bold text-gray-800">Speed</div>
                            <div className="text-gray-600">{difficulty.physics.pipeSpeed}</div>
                          </div>
                        </UICard>
                      </div>
                    </div>

                    {/* Select Button */}
                    <div className="flex-shrink-0">
                      <ModernButton
                        variant="primary"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectDifficulty(difficulty)
                        }}
                        className={`bg-gradient-to-r ${getDifficultyColor(difficulty.id)}`}
                      >
                        <span className="font-bold text-sm sm:text-base">Select</span>
                      </ModernButton>
                    </div>
                  </div>
                </UICard>
              ))}
            </div>

            {/* Tips */}
            <div className="max-w-2xl mx-auto mt-6 sm:mt-8">
              <UICard variant="gradient" padding="lg" className="border-2 border-blue-400/50">
                <h3 className="font-display text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Physics Tips
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm font-medium">
                  <li>• Higher gravity = faster falling, requires quicker reactions</li>
                  <li>• Pipe speed increases gradually as your score grows</li>
                  <li>• Power-ups temporarily reduce gravity and slow down pipes</li>
                  <li>• Wind resistance adds realistic physics to movement</li>
                </ul>
              </UICard>
            </div>

            <div className="h-4 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
