"use client"

import { useState, useEffect } from "react"
import HomeScreen from "@/components/home-screen"
import CharacterSelect from "@/components/character-select"
import ModeSelect from "@/components/mode-select"
import LevelSelect from "@/components/level-select"
import DifficultySelect from "@/components/difficulty-select"
import HowToPlay from "@/components/how-to-play"
import { difficultyModes, type DifficultyMode } from "@/components/game-physics"
import OptimizedGameScreen from "@/components/optimized-game-screen"

export type CharacterAbility =
  | "normal"
  | "extra-lives"
  | "invisibility"
  | "slow-gravity"
  | "small-hitbox"
  | "fast-flap"
  | "bonus-points"
  | "gla-shield-time-flight"
  | "jetpack-god-flight"

export type Character = {
  id: string
  name: string
  color: string
  avatar: string
  ability: CharacterAbility
  unlockCost: number
  description: string
}

export type GameMode = {
  id: string
  name: string
  icon: string
  description: string
  theme: "village" | "forest" | "sunset" | "mountain"
  unlockCost: number
}

export type Level = {
  id: number
  difficulty: "easy" | "medium" | "hard"
  targetScore: number
  unlocked: boolean
}

export const characters: Character[] = [
  {
    id: "tt",
    name: "TT",
    color: "#9CA3AF",
    avatar: "👤",
    ability: "normal",
    unlockCost: 0,
    description: "Default character with basic gameplay",
  },
  {
    id: "hitesh",
    name: "Hitesh",
    color: "#FFD700",
    avatar: "🧑‍🎨",
    ability: "gla-shield-time-flight",
    unlockCost: 30,
    description: "GLA Character with shield, time control, and resurrection!",
  },
  {
    id: "rudra",
    name: "Rudra",
    color: "#4ECDC4",
    avatar: "🧑‍🚀",
    ability: "extra-lives",
    unlockCost: 5,
    description: "Starts with 3 hearts - can hit pipes 3 times!",
  },
  {
    id: "ayush",
    name: "Ayush",
    color: "#45B7D1",
    avatar: "🧑‍💻",
    ability: "invisibility",
    unlockCost: 5,
    description: "Can go invisible for 3 seconds every 10 seconds",
  },
  {
    id: "ramji",
    name: "Ramji",
    color: "#96CEB4",
    avatar: "🧑‍🌾",
    ability: "slow-gravity",
    unlockCost: 10,
    description: "Slower gravity for better control",
  },
  {
    id: "harshit",
    name: "Satyam",
    color: "#F7DC6F",
    avatar: "🧑‍🔬",
    ability: "small-hitbox",
    unlockCost: 10,
    description: "Smaller hitbox - easier to pass through gaps",
  },
  {
    id: "samar",
    name: "Samar",
    color: "#BB8FCE",
    avatar: "🧑‍🎤",
    ability: "fast-flap",
    unlockCost: 10,
    description: "Faster flap speed for quick maneuvers",
  },
  {
    id: "pravesh",
    name: "Pravesh",
    color: "#85C1E9",
    avatar: "🧑‍💼",
    ability: "bonus-points",
    unlockCost: 10,
    description: "Bonus points every 5 pipes passed!",
  },
  {
    id: "kapil-sir",
    name: "Kapil Sir",
    color: "#1E40AF",
    avatar: "👨‍🏫",
    ability: "jetpack-god-flight",
    unlockCost: 100,
    description: "Jetpack God-Mode - fly through everything for 5 seconds!",
  },
]

export const gameModes: GameMode[] = [
  {
    id: "village-adventure",
    name: "Village Adventure",
    icon: "🏘️",
    description: "Fly through the peaceful village countryside",
    theme: "village",
    unlockCost: 0,
  },
  {
    id: "forest-journey",
    name: "Forest Journey",
    icon: "🌲",
    description: "Navigate through the dense forest paths",
    theme: "forest",
    unlockCost: 0,
  },
  {
    id: "sunset-flight",
    name: "Sunset Flight",
    icon: "🌅",
    description: "Soar through the golden sunset skies",
    theme: "sunset",
    unlockCost: 0,
  },
  {
    id: "mountain-climb",
    name: "Mountain Climb",
    icon: "⛰️",
    description: "Challenge the high mountain peaks",
    theme: "mountain",
    unlockCost: 0,
  },
]

export type GameState =
  | "home"
  | "character-select"
  | "mode-select"
  | "level-select"
  | "difficulty-select"
  | "how-to-play"
  | "playing"
  | "game-over"
  | "level-complete"

export default function FlappyHuman() {
  const [gameState, setGameState] = useState<GameState>("home")
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0])
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameModes[0])
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>(difficultyModes[1]) // Default to medium
  const [selectedLevel, setSelectedLevel] = useState<Level>({
    id: 1,
    difficulty: "easy",
    targetScore: 5,
    unlocked: true,
  })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [totalCoins, setTotalCoins] = useState(50)
  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>(["tt"])
  const [unlockedModes, setUnlockedModes] = useState<string[]>([
    "village-adventure",
    "forest-journey",
    "sunset-flight",
    "mountain-climb",
  ])
  const [completedLevels, setCompletedLevels] = useState<number[]>([])

  useEffect(() => {
    // Load saved data from localStorage
    const savedCharacter = localStorage.getItem("flappy-human-character")
    const savedHighScore = localStorage.getItem("flappy-human-high-score")
    const savedCoins = localStorage.getItem("flappy-human-coins")
    const savedUnlocked = localStorage.getItem("flappy-human-unlocked")
    const savedModes = localStorage.getItem("flappy-human-modes")
    const savedLevels = localStorage.getItem("flappy-human-levels")
    const savedDifficulty = localStorage.getItem("flappy-human-difficulty")

    // Handle character migration and selection
    let characterToSelect = characters[0] // Default to TT
    if (savedCharacter) {
      const character = characters.find((c) => c.id === savedCharacter)
      if (character) {
        // If saved character is Hitesh, check if they can still use it
        if (character.id === "hitesh") {
          const currentUnlocked = savedUnlocked ? JSON.parse(savedUnlocked) : ["tt"]
          if (currentUnlocked.includes("hitesh")) {
            characterToSelect = character
          } else {
            // Reset to TT if Hitesh is no longer unlocked
            characterToSelect = characters[0]
            localStorage.setItem("flappy-human-character", "tt")
          }
        } else {
          characterToSelect = character
        }
      }
    }
    setSelectedCharacter(characterToSelect)

    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    if (savedCoins) {
      setTotalCoins(Math.max(50, Number.parseInt(savedCoins)))
    }

    // Handle unlocked characters migration
    if (savedUnlocked) {
      const oldUnlocked = JSON.parse(savedUnlocked)
      // Remove Hitesh from unlocked if it was there before (since it now costs coins)
      const newUnlocked = oldUnlocked.filter((id: string) => id !== "hitesh")
      // Always ensure TT is unlocked
      if (!newUnlocked.includes("tt")) {
        newUnlocked.push("tt")
      }
      setUnlockedCharacters(newUnlocked)
      localStorage.setItem("flappy-human-unlocked", JSON.stringify(newUnlocked))
    } else {
      setUnlockedCharacters(["tt"])
    }

    if (savedModes) {
      setUnlockedModes(JSON.parse(savedModes))
    } else {
      setUnlockedModes(["village-adventure", "forest-journey", "sunset-flight", "mountain-climb"])
    }

    if (savedLevels) {
      setCompletedLevels(JSON.parse(savedLevels))
    }

    if (savedDifficulty) {
      const difficulty = difficultyModes.find((d) => d.id === savedDifficulty)
      if (difficulty) setSelectedDifficulty(difficulty)
    }
  }, [])

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    localStorage.setItem("flappy-human-character", character.id)
    setGameState("home")
  }

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode)
    setGameState("difficulty-select")
  }

  const handleDifficultySelect = (difficulty: DifficultyMode) => {
    setSelectedDifficulty(difficulty)
    localStorage.setItem("flappy-human-difficulty", difficulty.id)
    setGameState("level-select")
  }

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level)
    setGameState("playing")
  }

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore)
    if (finalScore > highScore) {
      setHighScore(finalScore)
      localStorage.setItem("flappy-human-high-score", finalScore.toString())
    }

    if (finalScore >= selectedLevel.targetScore) {
      if (!completedLevels.includes(selectedLevel.id)) {
        const newCompleted = [...completedLevels, selectedLevel.id]
        setCompletedLevels(newCompleted)
        localStorage.setItem("flappy-human-levels", JSON.stringify(newCompleted))
        setGameState("level-complete")
      } else {
        setGameState("game-over")
      }
    } else {
      setGameState("game-over")
    }
  }

  const resetGame = () => {
    setScore(0)
    setGameState("playing")
  }

  const handleCoinsCollected = (coins: number) => {
    const newTotal = totalCoins + coins
    setTotalCoins(newTotal)
    localStorage.setItem("flappy-human-coins", newTotal.toString())
  }

  const unlockCharacter = (characterId: string) => {
    const character = characters.find((c) => c.id === characterId)
    if (character && totalCoins >= character.unlockCost) {
      const newTotal = totalCoins - character.unlockCost
      setTotalCoins(newTotal)
      localStorage.setItem("flappy-human-coins", newTotal.toString())

      const newUnlocked = [...unlockedCharacters, characterId]
      setUnlockedCharacters(newUnlocked)
      localStorage.setItem("flappy-human-unlocked", JSON.stringify(newUnlocked))
    }
  }

  const unlockMode = (modeId: string) => {
    const mode = gameModes.find((m) => m.id === modeId)
    if (mode && totalCoins >= mode.unlockCost) {
      const newTotal = totalCoins - mode.unlockCost
      setTotalCoins(newTotal)
      localStorage.setItem("flappy-human-coins", newTotal.toString())

      const newUnlocked = [...unlockedModes, modeId]
      setUnlockedModes(newUnlocked)
      localStorage.setItem("flappy-human-modes", JSON.stringify(newUnlocked))
    }
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {gameState === "home" && (
        <HomeScreen
          onStartGame={() => setGameState("mode-select")}
          onSelectCharacter={() => setGameState("character-select")}
          onHowToPlay={() => setGameState("how-to-play")}
          selectedCharacter={selectedCharacter}
          highScore={highScore}
          totalCoins={totalCoins}
        />
      )}

      {gameState === "character-select" && (
        <CharacterSelect
          characters={characters}
          selectedCharacter={selectedCharacter}
          unlockedCharacters={unlockedCharacters}
          totalCoins={totalCoins}
          onSelectCharacter={handleCharacterSelect}
          onUnlockCharacter={unlockCharacter}
          onBack={() => setGameState("home")}
        />
      )}

      {gameState === "mode-select" && (
        <ModeSelect
          modes={gameModes}
          selectedMode={selectedMode}
          unlockedModes={unlockedModes}
          totalCoins={totalCoins}
          onSelectMode={handleModeSelect}
          onUnlockMode={unlockMode}
          onBack={() => setGameState("home")}
        />
      )}

      {gameState === "difficulty-select" && (
        <DifficultySelect onSelectDifficulty={handleDifficultySelect} onBack={() => setGameState("mode-select")} />
      )}

      {gameState === "level-select" && (
        <LevelSelect
          mode={selectedMode}
          completedLevels={completedLevels}
          onSelectLevel={handleLevelSelect}
          onBack={() => setGameState("difficulty-select")}
        />
      )}

      {gameState === "how-to-play" && <HowToPlay onBack={() => setGameState("home")} />}

      {(gameState === "playing" || gameState === "game-over" || gameState === "level-complete") && (
        <OptimizedGameScreen
          character={selectedCharacter}
          mode={selectedMode}
          level={selectedLevel}
          difficulty={selectedDifficulty}
          gameState={gameState}
          score={score}
          highScore={highScore}
          totalCoins={totalCoins}
          onGameOver={handleGameOver}
          onCoinsCollected={handleCoinsCollected}
          onRetry={resetGame}
          onHome={() => setGameState("home")}
          onNextLevel={() => setGameState("level-select")}
        />
      )}
    </div>
  )
}
