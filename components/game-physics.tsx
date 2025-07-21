"use client"

export interface GamePhysics {
  gravity: number
  jumpForce: number
  pipeSpeed: number
  maxFallSpeed: number
  rotationSpeed: number
}

export interface DifficultyMode {
  id: string
  name: string
  physics: GamePhysics
  description: string
}

export const difficultyModes: DifficultyMode[] = [
  {
    id: "easy",
    name: "Easy Mode",
    physics: {
      gravity: 0.5,
      jumpForce: -9,
      pipeSpeed: 2.5,
      maxFallSpeed: 8,
      rotationSpeed: 3,
    },
    description: "Gentle gravity and slower pipes - perfect for beginners",
  },
  {
    id: "medium",
    name: "Medium Mode",
    physics: {
      gravity: 0.6,
      jumpForce: -10,
      pipeSpeed: 3.5,
      maxFallSpeed: 10,
      rotationSpeed: 4,
    },
    description: "Balanced gameplay with moderate challenge",
  },
  {
    id: "hard",
    name: "Hard Mode",
    physics: {
      gravity: 0.7,
      jumpForce: -11,
      pipeSpeed: 4.5,
      maxFallSpeed: 12,
      rotationSpeed: 5,
    },
    description: "Fast-paced action for experienced players",
  },
]

export class GamePhysicsEngine {
  private physics: GamePhysics
  private windResistance = 0.02
  private speedMultiplier = 1
  private powerUpActive = false
  private powerUpTimer = 0

  constructor(difficulty: DifficultyMode) {
    this.physics = { ...difficulty.physics }
  }

  updatePhysics(velocityY: number, hasPowerUp = false): number {
    // Apply power-up effects
    if (hasPowerUp && !this.powerUpActive) {
      this.activatePowerUp()
    }

    // Update power-up timer
    if (this.powerUpActive) {
      this.powerUpTimer--
      if (this.powerUpTimer <= 0) {
        this.deactivatePowerUp()
      }
    }

    // Apply gravity with power-up modifications
    const currentGravity = this.powerUpActive ? this.physics.gravity * 0.7 : this.physics.gravity
    velocityY += currentGravity * this.speedMultiplier

    // Apply wind resistance for realism
    if (velocityY > 0) {
      velocityY *= 1 - this.windResistance
    }

    // Cap maximum fall speed
    const maxSpeed = this.powerUpActive ? this.physics.maxFallSpeed * 0.8 : this.physics.maxFallSpeed
    velocityY = Math.min(velocityY, maxSpeed)

    return velocityY
  }

  jump(): number {
    const jumpForce = this.powerUpActive ? this.physics.jumpForce * 1.2 : this.physics.jumpForce
    return jumpForce * this.speedMultiplier
  }

  getPipeSpeed(score: number): number {
    // Gradually increase speed based on score
    const speedIncrease = Math.floor(score / 10) * 0.3
    const currentSpeed = (this.physics.pipeSpeed + speedIncrease) * this.speedMultiplier

    if (this.powerUpActive) {
      return currentSpeed * 0.8 // Slow down pipes during power-up
    }

    return Math.min(currentSpeed, this.physics.pipeSpeed * 2) // Cap maximum speed
  }

  getRotation(velocityY: number): number {
    // Calculate rotation based on velocity (-30 to +90 degrees)
    const maxRotation = 90
    const minRotation = -30
    const normalizedVelocity = Math.max(-15, Math.min(15, velocityY))
    return ((normalizedVelocity / 15) * (maxRotation - minRotation)) / 2
  }

  activatePowerUp() {
    this.powerUpActive = true
    this.powerUpTimer = 300 // 5 seconds at 60fps
    this.speedMultiplier = 1.5
  }

  deactivatePowerUp() {
    this.powerUpActive = false
    this.powerUpTimer = 0
    this.speedMultiplier = 1
  }

  isPowerUpActive(): boolean {
    return this.powerUpActive
  }

  getPowerUpTimeLeft(): number {
    return Math.ceil(this.powerUpTimer / 60)
  }

  // Add vertical drift for realism
  getVerticalDrift(time: number): number {
    return Math.sin(time * 0.02) * 0.5
  }
}
