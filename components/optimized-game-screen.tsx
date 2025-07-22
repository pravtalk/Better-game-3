"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { ModernButton } from "./modern-button"
import { BouncingCoin } from "./bouncing-coin"
import { UICard } from "./ui-card"
import VillageBackground from "./village-background"
import { AnimatedCharacter } from "./animated-character"
import { AnimatedScore } from "./animated-score"
import { PerformanceEngine, EasingEngine, SmoothPhysics } from "./performance-engine"
import { RenderOptimizer, ViewportCuller } from "./render-optimizer"
import { GamePhysicsEngine, type DifficultyMode } from "./game-physics"
import { Home, RotateCcw, Play, Heart, Eye, EyeOff, Target, Zap, Activity } from "lucide-react"
import type { Character, GameMode, Level, GameState } from "@/app/page"

interface OptimizedGameScreenProps {
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

interface SmoothPipe {
  id: number
  x: number
  targetX: number
  y: number
  topHeight: number
  bottomHeight: number
  passed: boolean
  gapY: number
  velocity: number
}

interface SmoothCoin {
  id: number
  x: number
  y: number
  collected: boolean
  rotation: number
  scale: number
  targetScale: number
}

interface SmoothPowerUp {
  id: number
  x: number
  y: number
  collected: boolean
  type: "speed" | "gravity" | "shield"
  pulse: number
  rotation: number
}

export default function OptimizedGameScreen({
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
}: OptimizedGameScreenProps) {
  // Core game state
  const [birdY, setBirdY] = useState(300)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [birdRotation, setBirdRotation] = useState(0)
  const [smoothBirdY, setSmoothBirdY] = useState(300)
  const [smoothBirdRotation, setSmoothBirdRotation] = useState(0)

  // Game objects with smooth movement
  const [pipes, setPipes] = useState<SmoothPipe[]>([])
  const [coins, setCoins] = useState<SmoothCoin[]>([])
  const [powerUps, setPowerUps] = useState<SmoothPowerUp[]>([])

  // Game state
  const [currentScore, setCurrentScore] = useState(0)
  const [collectedCoins, setCollectedCoins] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [lives, setLives] = useState(character.ability === "extra-lives" ? 3 : 1)
  const [isInvisible, setIsInvisible] = useState(false)
  const [invisibilityCooldown, setInvisibilityCooldown] = useState(0)
  
  // GLA abilities state for Hitesh
  const [hasShield, setHasShield] = useState(character.ability === "gla-shield-time-flight")
  const [slowTimeActive, setSlowTimeActive] = useState(false)
  const [slowTimeCooldown, setSlowTimeCooldown] = useState(0)
  const [finalFlightActive, setFinalFlightActive] = useState(false)
  const [finalFlightUsed, setFinalFlightUsed] = useState(false)
  const [hasRevived, setHasRevived] = useState(false)

  // Performance monitoring
  const [fps, setFPS] = useState(60)
  const [renderTime, setRenderTime] = useState(0)
  const [showPerformance, setShowPerformance] = useState(false)

  // Engine instances
  const performanceEngine = useRef(new PerformanceEngine())
  const renderOptimizer = useRef(new RenderOptimizer())
  const viewportCuller = useRef(new ViewportCuller(800, 600))
  const smoothPhysics = useRef(
    new SmoothPhysics(difficulty.physics.gravity, difficulty.physics.jumpForce, difficulty.physics.maxFallSpeed),
  )
  const physicsEngine = useRef(new GamePhysicsEngine(difficulty))

  // Animation refs
  const gameLoopRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastJumpTime = useRef(0)
  const pipeIdCounter = useRef(0)
  const coinIdCounter = useRef(0)
  const powerUpIdCounter = useRef(0)

  // Smooth interpolation states
  const birdVelocityRef = useRef(0)
  const birdRotationVelocity = useRef(0)

  const hitboxSize = character.ability === "small-hitbox" ? 20 : 30

  // Memoized calculations
  const currentPipeSpeed = useMemo(() => {
    const baseSpeed = physicsEngine.current.getPipeSpeed(currentScore)
    // Apply slow time effect for GLA character
    return character.ability === "gla-shield-time-flight" && slowTimeActive ? baseSpeed * 0.3 : baseSpeed
  }, [currentScore, character.ability, slowTimeActive])

  // Optimized sound system
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

      gainNode.gain.setValueAtTime(0.05, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (e) {
      // Silently fail
    }
  }, [])

  // Optimized jump with debouncing
  const jump = useCallback(() => {
    if (gameState === "playing") {
      const now = performance.now()
      if (now - lastJumpTime.current < 100) return // Debounce rapid taps

      lastJumpTime.current = now
      const jumpForce = physicsEngine.current.jump()
      setBirdVelocity(jumpForce)
      birdVelocityRef.current = jumpForce

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
    setSmoothBirdY(300)
    setSmoothBirdRotation(0)
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
    
    // Reset GLA abilities
    setHasShield(character.ability === "gla-shield-time-flight")
    setSlowTimeActive(false)
    setSlowTimeCooldown(0)
    setFinalFlightActive(false)
    setFinalFlightUsed(false)
    setHasRevived(false)

    // Reset refs
    birdVelocityRef.current = 0
    birdRotationVelocity.current = 0
    pipeIdCounter.current = 0
    coinIdCounter.current = 0
    powerUpIdCounter.current = 0
    lastJumpTime.current = 0

    // Reset physics engines
    physicsEngine.current = new GamePhysicsEngine(difficulty)
    smoothPhysics.current = new SmoothPhysics(
      difficulty.physics.gravity,
      difficulty.physics.jumpForce,
      difficulty.physics.maxFallSpeed,
    )

    // Reset performance engine
    performanceEngine.current = new PerformanceEngine()
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
      if (e.code === "KeyP") {
        setShowPerformance((prev) => !prev)
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

  // Optimized main game loop with delta time
  useEffect(() => {
    if (gameState !== "playing" || !gameStarted) return

    const gameLoop = (currentTime: number) => {
      const renderStart = performance.now()

      const { deltaTime, shouldRender, fps: currentFPS } = performanceEngine.current.update(currentTime)

      if (shouldRender) {
        // Update physics with delta time (apply slow time effect)
        const effectiveDeltaTime = character.ability === "gla-shield-time-flight" && slowTimeActive ? deltaTime * 0.5 : deltaTime
        const newVelocity = smoothPhysics.current.updateVelocity(birdVelocityRef.current, effectiveDeltaTime)
        birdVelocityRef.current = newVelocity
        setBirdVelocity(newVelocity)

        const newY = smoothPhysics.current.updatePosition(birdY, newVelocity, effectiveDeltaTime)
        const clampedY = Math.max(0, Math.min(536, newY))
        setBirdY(clampedY)

        // Check for immediate game over on ground collision
        if (clampedY <= 0 || clampedY >= 536) {
          if (lives <= 1) {
            playSound(150, 0.5)
            onGameOver(currentScore)
            onCoinsCollected(collectedCoins)
            return
          }
        }

        // Smooth interpolation for visual position
        const smoothY = EasingEngine.smoothDamp(smoothBirdY, clampedY, 0, 0.1, deltaTime)
        setSmoothBirdY(smoothY.value)

        // Smooth rotation
        const targetRotation = smoothPhysics.current.getRotation(newVelocity)
        const smoothRotation = EasingEngine.smoothDamp(
          smoothBirdRotation,
          targetRotation,
          birdRotationVelocity.current,
          0.15,
          deltaTime,
        )
        setSmoothBirdRotation(smoothRotation.value)
        birdRotationVelocity.current = smoothRotation.velocity

        // Update pipes with smooth movement
        setPipes((prevPipes) => {
          const updatedPipes = prevPipes
            .map((pipe) => {
              const newX = pipe.x - currentPipeSpeed * deltaTime * 60
              return {
                ...pipe,
                x: newX,
                targetX: newX,
              }
            })
            .filter((pipe) => pipe.x > -100)

          // Add new pipes
          if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < 600) {
            const gapHeight = 150
            const gapY = Math.random() * 300 + 100
            const topHeight = Math.max(50, gapY - gapHeight / 2)
            const bottomHeight = Math.max(50, 600 - (gapY + gapHeight / 2) - 64)

            updatedPipes.push({
              id: pipeIdCounter.current++,
              x: 800,
              targetX: 800,
              y: 0,
              topHeight,
              bottomHeight,
              gapY,
              passed: false,
              velocity: currentPipeSpeed,
            })
          }

          return updatedPipes
        })

        // Update coins with smooth animation
        setCoins((prevCoins) => {
          const updatedCoins = prevCoins
            .map((coin) => {
              const newScale = EasingEngine.lerp(coin.scale, coin.targetScale, deltaTime * 5)
              return {
                ...coin,
                x: coin.x - currentPipeSpeed * deltaTime * 60,
                rotation: coin.rotation + deltaTime * 180, // Rotate 180 degrees per second
                scale: newScale,
              }
            })
            .filter((coin) => coin.x > -50)

          // Add new coins
          if (Math.random() < 0.015 * deltaTime * 60) {
            updatedCoins.push({
              id: coinIdCounter.current++,
              x: 800,
              y: Math.random() * 400 + 100,
              collected: false,
              rotation: 0,
              scale: 0,
              targetScale: 1,
            })
          }

          return updatedCoins
        })

        // Update power-ups with smooth pulsing
        setPowerUps((prevPowerUps) => {
          const updatedPowerUps = prevPowerUps
            .map((powerUp) => ({
              ...powerUp,
              x: powerUp.x - currentPipeSpeed * deltaTime * 60,
              pulse: powerUp.pulse + deltaTime * 4, // Pulse 4 times per second
              rotation: powerUp.rotation + deltaTime * 90, // Rotate 90 degrees per second
            }))
            .filter((powerUp) => powerUp.x > -50)

          // Add new power-ups
          if (Math.random() < 0.005 * deltaTime * 60 && !physicsEngine.current.isPowerUpActive()) {
            const types: SmoothPowerUp["type"][] = ["speed", "gravity", "shield"]
            updatedPowerUps.push({
              id: powerUpIdCounter.current++,
              x: 800,
              y: Math.random() * 400 + 100,
              collected: false,
              type: types[Math.floor(Math.random() * types.length)],
              pulse: 0,
              rotation: 0,
            })
          }

          return updatedPowerUps
        })

        // Handle invisibility cooldown
        if (invisibilityCooldown > 0) {
          setInvisibilityCooldown((prev) => Math.max(0, prev - deltaTime * 60))
        }
        
        // Handle GLA abilities for Hitesh
        if (character.ability === "gla-shield-time-flight") {
          // Slow time cooldown management
          if (slowTimeCooldown > 0) {
            setSlowTimeCooldown((prev) => Math.max(0, prev - deltaTime * 60))
          } else if (!slowTimeActive) {
            // Trigger slow time every 15 seconds
            setSlowTimeActive(true)
            setSlowTimeCooldown(900) // 15 seconds at 60fps
            setTimeout(() => setSlowTimeActive(false), 3000) // 3 seconds duration
            playSound(1400, 0.3)
          }
          
          // Final flight timer
          if (finalFlightActive) {
            setTimeout(() => {
              setFinalFlightActive(false)
              if (lives <= 0) {
                onGameOver(currentScore)
                onCoinsCollected(collectedCoins)
              }
            }, 5000) // 5 seconds of invincibility
          }
        }

        // Update performance metrics
        setFPS(currentFPS)
      }

      const renderEnd = performance.now()
      const currentRenderTime = renderEnd - renderStart
      performanceEngine.current.trackRenderTime(currentRenderTime)
      setRenderTime(performanceEngine.current.getAverageRenderTime())

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [
    gameState,
    gameStarted,
    birdY,
    smoothBirdY,
    smoothBirdRotation,
    currentPipeSpeed,
    currentScore,
    collectedCoins,
    onGameOver,
    onCoinsCollected,
    lives,
    playSound,
  ])

  // Optimized collision detection with spatial partitioning
  useEffect(() => {
    if (gameState !== "playing" || !gameStarted || isInvisible || finalFlightActive) return

    const birdRect = {
      x: 100 - hitboxSize / 2,
      y: smoothBirdY - hitboxSize / 2,
      width: hitboxSize,
      height: hitboxSize,
    }

    // Only check pipes that are near the bird
    const nearbyPipes = pipes.filter(
      (pipe) => Math.abs(pipe.x - 100) < 150 && viewportCuller.current.isVisible(pipe.x, 0, 80, 600),
    )

    for (const pipe of nearbyPipes) {
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
        // Handle GLA shield ability first
        if (character.ability === "gla-shield-time-flight" && hasShield) {
          setHasShield(false) // Shield absorbs one hit
          setIsInvisible(true)
          setTimeout(() => setIsInvisible(false), 1000)
          playSound(800, 0.3) // Different sound for shield
        } else if (lives > 1) {
          setLives((prev) => prev - 1)
          setIsInvisible(true)
          setTimeout(() => setIsInvisible(false), 1000)
          playSound(200, 0.3)
        } else {
          // Check for final flight ability (only for Hitesh)
          if (character.ability === "gla-shield-time-flight" && !finalFlightUsed && !hasRevived) {
            setFinalFlightActive(true)
            setFinalFlightUsed(true)
            setHasRevived(true)
            setLives(1) // Revive with 1 life
            setBirdY(300)
            setSmoothBirdY(300)
            setBirdVelocity(0)
            birdVelocityRef.current = 0
            playSound(1600, 0.5) // Special revival sound
          } else {
            playSound(150, 0.5)
            onGameOver(currentScore)
            onCoinsCollected(collectedCoins)
          }
        }
        return
      }
    }

    // Ground collision - updated logic
    if (smoothBirdY <= 0 || smoothBirdY >= 536) {
      // Handle GLA shield ability first
      if (character.ability === "gla-shield-time-flight" && hasShield) {
        setHasShield(false) // Shield absorbs one hit
        setBirdY(300)
        setSmoothBirdY(300)
        setBirdVelocity(0)
        birdVelocityRef.current = 0
        setIsInvisible(true)
        setTimeout(() => setIsInvisible(false), 1000)
        playSound(800, 0.3) // Different sound for shield
      } else if (lives > 1) {
        setLives((prev) => prev - 1)
        setBirdY(300)
        setSmoothBirdY(300)
        setBirdVelocity(0)
        birdVelocityRef.current = 0
        setIsInvisible(true)
        setTimeout(() => setIsInvisible(false), 1000)
        playSound(200, 0.3)
      } else {
        // Check for final flight ability (only for Hitesh)
        if (character.ability === "gla-shield-time-flight" && !finalFlightUsed && !hasRevived) {
          setFinalFlightActive(true)
          setFinalFlightUsed(true)
          setHasRevived(true)
          setLives(1) // Revive with 1 life
          setBirdY(300)
          setSmoothBirdY(300)
          setBirdVelocity(0)
          birdVelocityRef.current = 0
          playSound(1600, 0.5) // Special revival sound
        } else {
          playSound(150, 0.5)
          onGameOver(currentScore)
        onCoinsCollected(collectedCoins)
      }
      return // Important: exit early to prevent further collision checks
    }
  }
  }, [
    smoothBirdY,
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
    finalFlightActive,
    hasShield,
    character.ability,
    playSound,
  ])

  // Optimized scoring and collection with spatial queries
  useEffect(() => {
    // Score pipes
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

    // Collect coins
    setCoins((prev) =>
      prev.map((coin) => {
        if (!coin.collected) {
          const distance = Math.sqrt(Math.pow(coin.x - 100, 2) + Math.pow(coin.y - smoothBirdY, 2))
          if (distance < 30) {
            setCollectedCoins((coins) => coins + 1)
            playSound(800, 0.15)
            return { ...coin, collected: true, targetScale: 0 }
          }
        }
        return coin
      }),
    )

    // Collect power-ups
    setPowerUps((prev) =>
      prev.map((powerUp) => {
        if (!powerUp.collected) {
          const distance = Math.sqrt(Math.pow(powerUp.x - 100, 2) + Math.pow(powerUp.y - smoothBirdY, 2))
          if (distance < 35) {
            physicsEngine.current.activatePowerUp()
            playSound(1200, 0.3)
            return { ...powerUp, collected: true }
          }
        }
        return powerUp
      }),
    )
  }, [pipes, coins, powerUps, smoothBirdY, character.ability, playSound])

  // Invisibility ability
  const activateInvisibility = useCallback(() => {
    if (character.ability === "invisibility" && invisibilityCooldown === 0 && !isInvisible) {
      setIsInvisible(true)
      setInvisibilityCooldown(600)
      setTimeout(() => setIsInvisible(false), 3000)
      playSound(1000, 0.2)
    }
  }, [character.ability, invisibilityCooldown, isInvisible, playSound])

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
                  <span className="font-sans text-gray-700 font-bold">Performance:</span>
                  <span className="font-display text-lg font-black text-green-600">{fps} FPS</span>
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
                onClick={() => {
                  resetGame()
                  onRetry()
                }}
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
                variant="secondary"
                size="lg"
                onClick={() => {
                  resetGame()
                  onRetry()
                }}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-bold">Retry</span>
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
          {/* Optimized Bird with smooth interpolation */}
          <div
            className={`absolute transition-none ${isInvisible ? "opacity-50" : ""} ${finalFlightActive ? "animate-pulse" : ""}`}
            style={{
              left: "100px",
              top: `${smoothBirdY}px`,
              transform: `translate(-50%, -50%) rotate(${smoothBirdRotation}deg)`,
              willChange: "transform",
              filter: finalFlightActive ? "drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFA500)" : "none",
            }}
          >
            <AnimatedCharacter 
              character={character} 
              size="md" 
              animation="wiggle" 
              showSparkles={isInvisible || finalFlightActive} 
              showLightningTrail={finalFlightActive}
            />
            {finalFlightActive && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-30 animate-ping" />
            )}
          </div>

          {/* Optimized Pipes with viewport culling */}
          {pipes
            .filter((pipe) => viewportCuller.current.isVisible(pipe.x, 0, 80, 600))
            .map((pipe) => (
              <div key={pipe.id}>
                {/* Top Pipe */}
                <div
                  className="absolute bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-b-lg shadow-lg border-2 border-amber-800"
                  style={{
                    left: `${pipe.x}px`,
                    top: "0px",
                    width: "80px",
                    height: `${pipe.topHeight}px`,
                    willChange: "transform",
                    transform: "translateZ(0)", // Force GPU acceleration
                    boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)",
                    background: "linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #654321 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="absolute w-full h-0.5 bg-amber-900" style={{ top: `${i * 33}%` }} />
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
                    willChange: "transform",
                    transform: "translateZ(0)", // Force GPU acceleration
                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.3), 0 -4px 12px rgba(0,0,0,0.3)",
                    background: "linear-gradient(to top, #654321 0%, #A0522D 50%, #8B4513 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="absolute w-full h-0.5 bg-amber-900" style={{ top: `${i * 33}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}

          {/* Optimized Coins with smooth scaling */}
          {coins
            .filter((coin) => !coin.collected && viewportCuller.current.isVisible(coin.x, coin.y, 50, 50))
            .map((coin) => (
              <div
                key={coin.id}
                className="absolute"
                style={{
                  left: `${coin.x}px`,
                  top: `${coin.y}px`,
                  transform: `translate(-50%, -50%) rotate(${coin.rotation}deg) scale(${coin.scale})`,
                  willChange: "transform",
                }}
              >
                <BouncingCoin count={1} size="lg" showCount={false} animate={false} />
              </div>
            ))}

          {/* Optimized Power-ups with smooth pulsing */}
          {powerUps
            .filter((powerUp) => !powerUp.collected && viewportCuller.current.isVisible(powerUp.x, powerUp.y, 60, 60))
            .map((powerUp) => (
              <div
                key={powerUp.id}
                className="absolute"
                style={{
                  left: `${powerUp.x}px`,
                  top: `${powerUp.y}px`,
                  transform: `translate(-50%, -50%) rotate(${powerUp.rotation}deg) scale(${1 + Math.sin(powerUp.pulse) * 0.2})`,
                  willChange: "transform",
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

            {/* Performance indicator */}
            {showPerformance && (
              <UICard variant="glass" padding="sm" className="border border-white/40">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="font-sans text-green-800 text-xs font-bold">
                    {fps} FPS | {renderTime.toFixed(1)}ms
                  </span>
                </div>
              </UICard>
            )}

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

            {character.ability === "gla-shield-time-flight" && (
              <div className="space-y-2">
                {/* Shield Indicator */}
                <UICard 
                  variant={hasShield ? "gradient" : "glass"} 
                  padding="sm" 
                  className={`border ${hasShield ? "border-yellow-400/60 shadow-glow-yellow" : "border-white/40"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <span className="font-sans text-xs font-bold text-gray-800">
                      {hasShield ? "Shield Active" : "Shield Used"}
                    </span>
                  </div>
                </UICard>

                {/* Slow Time Indicator */}
                <UICard 
                  variant={slowTimeActive ? "gradient" : "glass"} 
                  padding="sm" 
                  className={`border ${slowTimeActive ? "border-blue-400/60 shadow-glow-blue animate-pulse" : "border-white/40"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span className="font-sans text-xs font-bold text-gray-800">
                      {slowTimeActive ? "Time Slowed" : slowTimeCooldown > 0 ? `${Math.ceil(slowTimeCooldown / 60)}s` : "Ready"}
                    </span>
                  </div>
                </UICard>

                {/* Final Flight Indicator */}
                <UICard 
                  variant={finalFlightActive ? "gradient" : finalFlightUsed ? "glass" : "elevated"} 
                  padding="sm" 
                  className={`border ${finalFlightActive ? "border-gold-400/60 shadow-glow-gold animate-pulse" : finalFlightUsed ? "border-white/40" : "border-gold-400/40"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👼</span>
                    <span className="font-sans text-xs font-bold text-gray-800">
                      {finalFlightActive ? "INVINCIBLE!" : finalFlightUsed ? "Flight Used" : "Flight Ready"}
                    </span>
                  </div>
                </UICard>
              </div>
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
              <h3 className="font-display text-2xl font-black text-gray-800 mb-4">Optimized & Smooth!</h3>
              <p className="font-sans text-gray-700 font-bold mb-2">
                Tap anywhere for buttery smooth {character.name} flight!
              </p>
              <UICard variant="glass" padding="sm" className="mt-4 border border-white/40">
                <p className="font-sans text-xs text-gray-700 font-medium">
                  60 FPS | Delta Time | Smooth Physics | Press P for performance
                </p>
              </UICard>
            </UICard>
          </div>
        )}
      </div>
    </div>
  )
}
