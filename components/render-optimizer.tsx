"use client"

export class RenderOptimizer {
  private lastRenderState: any = {}
  private dirtyFlags: Set<string> = new Set()
  private renderQueue: Map<string, () => void> = new Map()

  // Check if component needs re-render
  shouldRender(key: string, newState: any): boolean {
    const lastState = this.lastRenderState[key]
    const hasChanged = JSON.stringify(lastState) !== JSON.stringify(newState)

    if (hasChanged) {
      this.lastRenderState[key] = newState
      this.dirtyFlags.add(key)
    }

    return hasChanged
  }

  // Mark component as dirty
  markDirty(key: string) {
    this.dirtyFlags.add(key)
  }

  // Check if component is dirty
  isDirty(key: string): boolean {
    return this.dirtyFlags.has(key)
  }

  // Clear dirty flag
  clearDirty(key: string) {
    this.dirtyFlags.delete(key)
  }

  // Batch render operations
  queueRender(key: string, renderFn: () => void) {
    this.renderQueue.set(key, renderFn)
  }

  // Execute all queued renders
  flushRenders() {
    this.renderQueue.forEach((renderFn, key) => {
      if (this.isDirty(key)) {
        renderFn()
        this.clearDirty(key)
      }
    })
    this.renderQueue.clear()
  }

  // Object pooling for game objects
  private pools: Map<string, any[]> = new Map()

  getFromPool<T>(type: string, createFn: () => T): T {
    if (!this.pools.has(type)) {
      this.pools.set(type, [])
    }

    const pool = this.pools.get(type)!
    return pool.length > 0 ? pool.pop() : createFn()
  }

  returnToPool(type: string, object: any) {
    if (!this.pools.has(type)) {
      this.pools.set(type, [])
    }

    const pool = this.pools.get(type)!
    if (pool.length < 50) {
      // Limit pool size
      pool.push(object)
    }
  }
}

// Viewport culling for off-screen objects
export class ViewportCuller {
  private viewportWidth: number
  private viewportHeight: number
  private margin: number

  constructor(width: number, height: number, margin = 100) {
    this.viewportWidth = width
    this.viewportHeight = height
    this.margin = margin
  }

  isVisible(x: number, y: number, width = 0, height = 0): boolean {
    return (
      x + width >= -this.margin &&
      x <= this.viewportWidth + this.margin &&
      y + height >= -this.margin &&
      y <= this.viewportHeight + this.margin
    )
  }

  updateViewport(width: number, height: number) {
    this.viewportWidth = width
    this.viewportHeight = height
  }
}
