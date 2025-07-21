"use client"

export class PerformanceEngine {
  private lastTime = 0
  private deltaTime = 0
  private targetFPS = 60
  private frameTime = 1000 / this.targetFPS
  private accumulator = 0
  private currentFPS = 0
  private frameCount = 0
  private fpsUpdateTime = 0

  // Performance monitoring
  private renderTimes: number[] = []
  private maxRenderTimes = 60

  constructor() {
    this.lastTime = performance.now()
  }

  update(currentTime: number): { deltaTime: number; shouldRender: boolean; fps: number } {
    this.deltaTime = Math.min(currentTime - this.lastTime, 33.33) // Cap at ~30fps minimum
    this.lastTime = currentTime
    this.accumulator += this.deltaTime

    // Calculate FPS
    this.frameCount++
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.currentFPS = this.frameCount
      this.frameCount = 0
      this.fpsUpdateTime = currentTime
    }

    // Fixed timestep with interpolation
    const shouldRender = this.accumulator >= this.frameTime
    if (shouldRender) {
      this.accumulator -= this.frameTime
    }

    return {
      deltaTime: this.deltaTime / 1000, // Convert to seconds
      shouldRender,
      fps: this.currentFPS,
    }
  }

  trackRenderTime(renderTime: number) {
    this.renderTimes.push(renderTime)
    if (this.renderTimes.length > this.maxRenderTimes) {
      this.renderTimes.shift()
    }
  }

  getAverageRenderTime(): number {
    if (this.renderTimes.length === 0) return 0
    return this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
  }

  isPerformanceGood(): boolean {
    return this.getAverageRenderTime() < 16.67 // 60fps threshold
  }
}

export class EasingEngine {
  // Smooth easing functions
  static easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t)
  }

  static easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Smooth interpolation
  static lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  // Smooth damping for physics
  static smoothDamp(
    current: number,
    target: number,
    currentVelocity: number,
    smoothTime: number,
    deltaTime: number,
    maxSpeed = Number.POSITIVE_INFINITY,
  ): { value: number; velocity: number } {
    smoothTime = Math.max(0.0001, smoothTime)
    const omega = 2 / smoothTime
    const x = omega * deltaTime
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)

    let change = current - target
    const originalTo = target
    const maxChange = maxSpeed * smoothTime

    change = Math.max(-maxChange, Math.min(change, maxChange))
    target = current - change

    const temp = (currentVelocity + omega * change) * deltaTime
    currentVelocity = (currentVelocity - omega * temp) * exp
    let output = target + (change + temp) * exp

    if (originalTo - current > 0 === output > originalTo) {
      output = originalTo
      currentVelocity = (output - originalTo) / deltaTime
    }

    return { value: output, velocity: currentVelocity }
  }
}

export class SmoothPhysics {
  private gravity: number
  private jumpForce: number
  private maxFallSpeed: number
  private airResistance: number
  private terminalVelocity: number

  constructor(gravity = 0.6, jumpForce = -10, maxFallSpeed = 12) {
    this.gravity = gravity
    this.jumpForce = jumpForce
    this.maxFallSpeed = maxFallSpeed
    this.airResistance = 0.98
    this.terminalVelocity = maxFallSpeed
  }

  updateVelocity(currentVelocity: number, deltaTime: number, isJumping = false): number {
    if (isJumping) {
      return this.jumpForce
    }

    // Apply gravity with delta time
    let newVelocity = currentVelocity + this.gravity * deltaTime * 60 // Scale for 60fps baseline

    // Apply air resistance for more realistic physics
    newVelocity *= this.airResistance

    // Limit maximum fall speed
    newVelocity = Math.min(newVelocity, this.terminalVelocity)

    return newVelocity
  }

  updatePosition(currentPosition: number, velocity: number, deltaTime: number): number {
    return currentPosition + velocity * deltaTime * 60 // Scale for 60fps baseline
  }

  getRotation(velocity: number): number {
    // Smooth rotation based on velocity with easing
    const normalizedVelocity = Math.max(-15, Math.min(15, velocity))
    const targetRotation = (normalizedVelocity / 15) * 45 // -45 to +45 degrees
    return targetRotation
  }
}
