"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ModernButton } from "./modern-button"
import { BouncingCoin } from "./bouncing-coin"
import { UICard } from "./ui-card"
import VillageBackground from "./village-background"
import { AnimatedCharacter } from "./animated-character"
import { AnimatedScore } from "./animated-score"
import { GamePhysicsEngine, type DifficultyMode } from "./game-physics"
import { Home, RotateCcw, Play, Heart, Eye, EyeOff, Target, Zap } from "lucide-react"
import type { Character, GameMode, Level, GameState } from "@/app/page"

interface EnhancedGameScreenProps {
  character: Character
  mode: GameMode
  level: Level
  difficulty: DifficultyMode
  gameState: GameState
  score: number
  highScore: number
  totalCoins: number
  onGameOver: (score: number) => void
  onCoinsCollected: (coins: number) => void
  onRetry: () => void
  onHome: () => void
  onNextLevel: () => void
}

interface Pipe {
  x: number
  topHeight: number
  bottomHeight: number
  passed: boolean
  gapY: number
}

interface Coin {
  x: number
  y: number
  collected: boolean
}

interface PowerUp {
  x: number
  y: number
  collected: boolean
  type: "speed" | "gravity" | "shield"
}

export default function EnhancedGameScreen({
  character,
  mode,
  level,
  difficulty,
  gameState,
  score,
  highScore,
  totalCoins,
  onGameOver,
  onCoinsCollected,
  onRetry,
  onHome,
  onNextLevel,
}: EnhancedGameScreenProps) {
  const [birdY, setBirdY] = useState(300)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [birdRotation, setBirdRotation] = useState(0)
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [currentScore, setCurrentScore] = useState(0)
  const [collectedCoins, setCollectedCoins] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [lives, setLives] = useState(character.ability === "extra-lives" ? 3 : 1)
  const [isInvisible, setIsInvisible] = useState(false)
  const [invisibilityCooldown, setInvisibilityCooldown] = useState(0)
  const [gameTime, setGameTime] = useState(0)

  const gameLoopRef = useRef<number>()
  const physicsEngine = useRef<GamePhysicsEngine>(new GamePhysicsEngine(difficulty))
  const audioContextRef = useRef<AudioContext | null>(null)

  const hitboxSize = 30 // Standard hitbox size (small-hitbox ability was removed)

  // Sound effects
  const playSound = useCallback((frequency: number, duration: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }, [])

  const jump = useCallback(() => {
    if (gameState === "playing") {
      const jumpForce = physicsEngine.current.jump()
      setBirdVelocity(jumpForce)
      setShowInstructions(false)
      if (!gameStarted) {
        setGameStarted(true)
      }
      playSound(400, 0.1)
    }
  }, [gameState, gameStarted, playSound])

  const resetGame = useCallback(() => {
    setBirdY(300)
    setBirdVelocity(0)
    setBirdRotation(0)
    setPipes([])
    setCoins([])
    setPowerUps([])
    setCurrentScore(0)
    setCollectedCoins(0)
    setGameStarted(false)
    setShowInstructions(true)
    setLives(character.ability === "extra-lives" ? 3 : 1)
    setIsInvisible(false)
    setInvisibilityCooldown(0)
    setGameTime(0)
    physicsEngine.current = new GamePhysicsEngine(difficulty)
  }, [character.ability, difficulty])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => jump()

    window.addEventListener("keydown", handleKeyPress)
    window.addEventListener("click", handleClick)
    window.addEventListener("touchstart", handleClick)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("touchstart", handleClick)
    }
  }, [jump])

  // Main game loop with enhanced physics
  useEffect(() => {
    if (gameState !== "playing" || !gameStarted) return

    const gameLoop = () => {
      setGameTime((prev) => prev + 1)

      // Update bird physics
      setBirdVelocity((prevVelocity) => {
        const hasPowerUp = physicsEngine.current.isPowerUpActive()
        return physicsEngine.current.updatePhysics(prevVelocity, hasPowerUp)
      })

      setBirdY((prev) => {
        const newY = prev + birdVelocity
        // Add vertical drift for realism
        const drift = physicsEngine.current.getVerticalDrift(gameTime)
        return Math.max(0, Math.min(536, newY + drift)) // Account for ground height
      })

      // Update bird rotation based on velocity
      setBirdRotation(physicsEngine.current.getRotation(birdVelocity))

      // Generate pipes with randomized gaps
      setPipes((prev) => {
        const newPipes = [...prev]
        const currentPipeSpeed = physicsEngine.current.getPipeSpeed(currentScore)

        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 600) {
          const gapHeight = 150
          const gapY = Math.random() * 300 + 100 // Random gap position
          const topHeight = gapY - gapHeight / 2
          const bottomStart = gapY + gapHeight / 2
          const bottomHeight = 600 - bottomStart - 64

          newPipes.push({
            x: 800,
            topHeight: Math.max(50, topHeight),
            bottomHeight: Math.max(50, bottomHeight),
            gapY,
            passed: false,
          })
        }

        return newPipes.map((pipe) => ({ ...pipe, x: pipe.x - currentPipeSpeed })).filter((pipe) => pipe.x > -100)
      })

      // Generate coins
      setCoins((prev) => {
        const newCoins = [...prev]
        const currentPipeSpeed = physicsEngine.current.getPipeSpeed(currentScore)

        if (Math.random() < 0.015) {
          newCoins.push({
            x: 800,
            y: Math.random() * 400 + 100,
            collected: false,
          })
        }

        return newCoins.map((coin) => ({ ...coin, x: coin.x - currentPipeSpeed })).filter((coin) => coin.x > -50)
      })

      // Generate power-ups
      setPowerUps((prev) => {
        const newPowerUps = [...prev]
        const currentPipeSpeed = physicsEngine.current.getPipeSpeed(currentScore)

        if (Math.random() < 0.005 && !physicsEngine.current.isPowerUpActive()) {
          const types: PowerUp["type"][] = ["speed", "gravity", "shield"]
          newPowerUps.push({
            x: 800,
            y: Math.random() * 400 + 100,
            collected: false,
            type: types[Math.floor(Math.random() * types.length)],
          })
        }

        return newPowerUps
          .map((powerUp) => ({ ...powerUp, x: powerUp.x - currentPipeSpeed }))
          .filter((powerUp) => powerUp.x > -50)
      })

      // Handle invisibility cooldown
      if (invisibilityCooldown > 0) {
        setInvisibilityCooldown((prev) => prev - 1)
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, gameStarted, birdVelocity, currentScore, invisibilityCooldown, gameTime])

  // Enhanced collision detection
  useEffect(() => {
    if (gameState !== "playing" || !gameStarted || isInvisible) return

    const birdRect = {
      x: 100 - hitboxSize / 2,
      y: birdY - hitboxSize / 2,
      width: hitboxSize,
      height: hitboxSize,
    }

    // Check pipe collisions
    for (const pipe of pipes) {
      const topPipe = {
        x: pipe.x,
        y: 0,
        width: 80,
        height: pipe.topHeight,
      }

      const bottomPipe = {
        x: pipe.x,
        y: 600 - pipe.bottomHeight - 64,
        width: 80,
        height: pipe.bottomHeight,
      }

      if (
        (birdRect.x < topPipe.x + topPipe.width &&
          birdRect.x + birdRect.width > topPipe.x &&
          birdRect.y < topPipe.y + topPipe.height &&
          birdRect.y + birdRect.height > topPipe.y) ||
        (birdRect.x < bottomPipe.x + bottomPipe.width &&
          birdRect.x + birdRect.width > bottomPipe.x &&
          birdRect.y < bottomPipe.y + bottomPipe.height &&
          birdRect.y + birdRect.height > bottomPipe.y)
      ) {
        if (lives > 1) {
          setLives((prev) => prev - 1)
          setIsInvisible(true)
          setTimeout(() => setIsInvisible(false), 1000)
          playSound(200, 0.3)
        } else {
          playSound(150, 0.5)
          onGameOver(currentScore)
          onCoinsCollected(collectedCoins)
        }
        return
      }
    }

    // Check ground collision
    if (birdY <= 0 || birdY >= 536) {
      if (lives > 1) {
        setLives((prev) => prev - 1)
        setBirdY(300)
        setBirdVelocity(0)
        setIsInvisible(true)
        setTimeout(() => setIsInvisible(false), 1000)
        playSound(200, 0.3)
      } else {
        playSound(150, 0.5)
        onGameOver(currentScore)
        onCoinsCollected(collectedCoins)
      }
    }
  }, [
    birdY,
    pipes,
    gameState,
    gameStarted,
    currentScore,
    collectedCoins,
    onGameOver,
    onCoinsCollected,
    lives,
    hitboxSize,
    isInvisible,
    playSound,
  ])

  // Score and item collection
  useEffect(() => {
    setPipes((prev) =>
      prev.map((pipe) => {
        if (!pipe.passed && pipe.x + 80 < 100) {
          setCurrentScore((score) => {
            const newScore = score + 1
            playSound(600, 0.2)
            if (character.ability === "bonus-points" && newScore % 5 === 0) {
              return newScore + 2
            }
            return newScore
          })
          return { ...pipe, passed: true }
        }
        return pipe
      }),
    )

    setCoins((prev) =>
      prev.map((coin) => {
        if (!coin.collected) {
          const distance = Math.sqrt(Math.pow(coin.x - 100, 2) + Math.pow(coin.y - birdY, 2))
          if (distance < 30) {
            setCollectedCoins((coins) => coins + 1)
            playSound(800, 0.15)
            return { ...coin, collected: true }
          }
        }
        return coin
      }),
    )

    setPowerUps((prev) =>
      prev.map((powerUp) => {
        if (!powerUp.collected) {
          const distance = Math.sqrt(Math.pow(powerUp.x - 100, 2) + Math.pow(powerUp.y - birdY, 2))
          if (distance < 35) {
            physicsEngine.current.activatePowerUp()
            playSound(1200, 0.3)
            return { ...powerUp, collected: true }
          }
        }
        return powerUp
      }),
    )
  }, [pipes, coins, powerUps, birdY, character.ability, playSound])

  // Invisibility ability
  const activateInvisibility = () => {
    if (character.ability === "invisibility" && invisibilityCooldown === 0 && !isInvisible) {
      setIsInvisible(true)
      setInvisibilityCooldown(600)
      setTimeout(() => setIsInvisible(false), 3000)
      playSound(1000, 0.2)
    }
  }

  if (gameState === "game-over") {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <VillageBackground theme={mode.theme} parallax={false} />

        <div className="relative z-10 flex items-center justify-center h-full p-6">
          <UICard variant="elevated" padding="xl" className="text-center max-w-md w-full shadow-2xl">
            <div className="text-6xl mb-6">💥</div>
            <h2 className="font-display text-4xl font-black text-gray-800 mb-6">Game Over!</h2>

            <div className="space-y-4 mb-8">
              <UICard variant="glass" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Score:</span>
                  <AnimatedScore score={score} className="text-2xl text-gray-800" />
                </div>
              </UICard>

              <UICard variant="glass" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Best:</span>
                  <span className="font-display text-xl font-black text-yellow-600">{highScore}</span>
                </div>
              </UICard>

              <UICard variant="glass" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Difficulty:</span>
                  <span className="font-display text-lg font-black text-purple-600">{difficulty.name}</span>
                </div>
              </UICard>

              <UICard variant="glass" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Coins:</span>
                  <BouncingCoin count={collectedCoins} size="md" animate={true} />
                </div>
              </UICard>
            </div>

            <div className="flex gap-4">
              <ModernButton
                variant="primary"
                size="lg"
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-bold">Retry</span>
              </ModernButton>
              <ModernButton
                variant="light"
                size="lg"
                onClick={onHome}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                <span className="font-bold">Home</span>
              </ModernButton>
            </div>
          </UICard>
        </div>
      </div>
    )
  }

  if (gameState === "level-complete") {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <VillageBackground theme={mode.theme} parallax={false} />

        <div className="relative z-10 flex items-center justify-center h-full p-6">
          <UICard variant="elevated" padding="xl" className="text-center max-w-md w-full shadow-2xl">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="font-display text-4xl font-black text-gray-800 mb-6">Level Complete!</h2>

            <div className="space-y-4 mb-8">
              <UICard variant="gradient" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Score:</span>
                  <AnimatedScore score={score} className="text-2xl text-gray-800" />
                </div>
              </UICard>

              <UICard variant="glass" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Target:</span>
                  <span className="font-display text-xl font-black text-green-600">{level.targetScore}</span>
                </div>
              </UICard>

              <UICard variant="glass" padding="md">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-gray-700 font-bold">Coins:</span>
                  <BouncingCoin count={collectedCoins} size="md" animate={true} />
                </div>
              </UICard>
            </div>

            <div className="flex gap-4">
              <ModernButton
                variant="success"
                size="lg"
                onClick={onNextLevel}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span className="font-bold">Next Level</span>
              </ModernButton>
              <ModernButton
                variant="light"
                size="lg"
                onClick={onHome}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                <span className="font-bold">Home</span>
              </ModernButton>
            </div>
          </UICard>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VillageBackground theme={mode.theme} parallax={true} />

      <div className="relative z-10">
        {/* Game Elements */}
        <div className="absolute inset-0">
          {/* Bird with rotation */}
          <div
            className={`absolute transition-all duration-100 ${isInvisible ? "opacity-50" : ""}`}
            style={{
              left: "100px",
              top: `${birdY}px`,
              transform: `translate(-50%, -50%) rotate(${birdRotation}deg)`,
            }}
          >
            <AnimatedCharacter character={character} size="md" animation="wiggle" showSparkles={isInvisible} />
          </div>

          {/* Enhanced Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              {/* Top Pipe */}
              <div
                className="absolute bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-b-lg shadow-lg border-2 border-amber-800"
                style={{
                  left: `${pipe.x}px`,
                  top: "0px",
                  width: "80px",
                  height: `${pipe.topHeight}px`,
                  boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)",
                  background: "linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #654321 100%)",
                }}
              >
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="absolute w-full h-0.5 bg-amber-900" style={{ top: `${i * 20}%` }} />
                  ))}
                </div>
              </div>

              {/* Bottom Pipe */}
              <div
                className="absolute bg-gradient-to-t from-amber-800 via-amber-600 to-amber-700 rounded-t-lg shadow-lg border-2 border-amber-800"
                style={{
                  left: `${pipe.x}px`,
                  top: `${600 - pipe.bottomHeight - 64}px`,
                  width: "80px",
                  height: `${pipe.bottomHeight}px`,
                  boxShadow: "inset 0 4px 8px rgba(0,0,0,0.3), 0 -4px 12px rgba(0,0,0,0.3)",
                  background: "linear-gradient(to top, #654321 0%, #A0522D 50%, #8B4513 100%)",
                }}
              >
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="absolute w-full h-0.5 bg-amber-900" style={{ top: `${i * 20}%` }} />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Coins */}
          {coins
            .filter((coin) => !coin.collected)
            .map((coin, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${coin.x}px`,
                  top: `${coin.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <BouncingCoin count={1} size="lg" showCount={false} animate={false} />
              </div>
            ))}

          {/* Power-ups */}
          {powerUps
            .filter((powerUp) => !powerUp.collected)
            .map((powerUp, index) => (
              <div
                key={index}
                className="absolute animate-pulse"
                style={{
                  left: `${powerUp.x}px`,
                  top: `${powerUp.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
        </div>

        {/* Enhanced UI Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start">
          {/* Score Section */}
          <div className="space-y-3">
            <UICard variant="glass" padding="md" className="shadow-lg border border-white/40">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <AnimatedScore score={currentScore} className="text-2xl text-gray-800" />
              </div>
            </UICard>

            <UICard variant="glass" padding="sm" className="border border-white/40">
              <BouncingCoin count={collectedCoins} size="sm" animate={true} />
            </UICard>

            {/* Power-up indicator */}
            {physicsEngine.current.isPowerUpActive() && (
              <UICard variant="gradient" padding="sm" className="border border-purple-400/50 animate-pulse">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="font-sans text-purple-800 text-sm font-bold">
                    {physicsEngine.current.getPowerUpTimeLeft()}s
                  </span>
                </div>
              </UICard>
            )}
          </div>

          {/* Level Info */}
          <div className="text-center space-y-2">
            <UICard variant="glass" padding="sm" className="border border-white/40">
              <span className="font-sans text-gray-800 text-sm font-bold">Level {level.id}</span>
            </UICard>
            <UICard variant="glass" padding="sm" className="border border-white/40">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-gray-700" />
                <span className="font-sans text-gray-700 text-sm font-bold">{level.targetScore}</span>
              </div>
            </UICard>
            <UICard variant="glass" padding="sm" className="border border-white/40">
              <span className="font-sans text-gray-700 text-xs font-bold">{difficulty.name}</span>
            </UICard>
          </div>

          {/* Character Abilities */}
          <div className="space-y-2">
            {character.ability === "extra-lives" && (
              <UICard variant="glass" padding="sm" className="border border-white/40">
                <div className="flex gap-1">
                  {Array.from({ length: lives }).map((_, i) => (
                    <Heart key={i} className="w-5 h-5 text-red-500 fill-current" />
                  ))}
                </div>
              </UICard>
            )}

            {character.ability === "invisibility" && (
              <ModernButton
                variant={invisibilityCooldown > 0 ? "light" : "warning"}
                size="sm"
                onClick={activateInvisibility}
                disabled={invisibilityCooldown > 0 || isInvisible}
                className="text-xs min-w-[80px] border border-white/40"
              >
                {isInvisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : invisibilityCooldown > 0 ? (
                  `${Math.ceil(invisibilityCooldown / 60)}s`
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </ModernButton>
            )}
          </div>
        </div>

        {/* Enhanced Instructions */}
        {showInstructions && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <UICard
              variant="elevated"
              padding="xl"
              className="text-center max-w-sm shadow-2xl border-2 border-white/50"
            >
              <div className="text-6xl mb-6 animate-bounce">👆</div>
              <h3 className="font-display text-2xl font-black text-gray-800 mb-4">Ready to Fly!</h3>
              <p className="font-sans text-gray-700 font-bold mb-2">
                Tap anywhere to make {character.name} soar through the village!
              </p>
              <UICard variant="glass" padding="sm" className="mt-4 border border-white/40">
                <p className="font-sans text-xs text-gray-700 font-medium">
                  Difficulty: {difficulty.name} | Gravity: {difficulty.physics.gravity}
                </p>
              </UICard>
            </UICard>
          </div>
        )}
      </div>
    </div>
  )
}
