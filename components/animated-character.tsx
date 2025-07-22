interface AnimatedCharacterProps {
  character: {
    avatar: string
    color: string
    name: string
    ability?: string
  }
  size?: "sm" | "md" | "lg" | "xl"
  animation?: "float" | "bounce" | "wiggle" | "pulse"
  showSparkles?: boolean
  showLightningTrail?: boolean
  showJetpackEffects?: boolean
  showCloneEffects?: boolean
}

export function AnimatedCharacter({
  character,
  size = "md",
  animation = "float",
  showSparkles = false,
  showLightningTrail = false,
  showJetpackEffects = false,
  showCloneEffects = false,
}: AnimatedCharacterProps) {
  const isGLA = character.ability === "gla-shield-time-flight"
  const isKapilSir = character.ability === "jetpack-god-flight"
  const isSatyam = character.ability === "clone-revival"
  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl",
  }

  const animations = {
    float: "animate-float",
    bounce: "animate-bounce",
    wiggle: "animate-wiggle",
    pulse: "animate-pulse",
  }

  return (
    <div className="relative inline-block">
      {/* Character */}
      <div
        className={`${sizes[size]} ${animations[animation]} drop-shadow-lg`}
        style={{ filter: `drop-shadow(0 0 10px ${character.color}40)` }}
      >
        {character.avatar}
      </div>

      {/* Sparkles */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 animate-sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Lightning Trail for GLA Character */}
      {(isGLA || showLightningTrail) && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-ping"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: "1.5s",
              }}
            >
              ⚡
            </div>
          ))}
        </div>
      )}

      {/* Jetpack Effects for Kapil Sir */}
      {(isKapilSir || showJetpackEffects) && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Jetpack on back */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-blue-600 animate-pulse">
            🎒
          </div>
          {/* Particle trail */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-blue-400 animate-bounce"
              style={{
                left: `${-10 + Math.random() * 20}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: "0.8s",
              }}
            >
              💨
            </div>
          ))}
        </div>
      )}

      {/* Glow Effect */}
      <div
        className={`absolute inset-0 rounded-full opacity-30 animate-pulse`}
        style={{
          background: isGLA 
            ? `radial-gradient(circle, #FFD70080 0%, #FFA50080 50%, transparent 70%)`
            : isKapilSir && showJetpackEffects
            ? `radial-gradient(circle, #1E40AF80 0%, #3B82F680 50%, transparent 70%)`
            : isSatyam && showCloneEffects
            ? `radial-gradient(circle, #F7DC6F80 0%, #F39C1280 50%, transparent 70%)`
            : `radial-gradient(circle, ${character.color}40 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
