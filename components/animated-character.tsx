interface AnimatedCharacterProps {
  character: {
    avatar: string
    color: string
    name: string
  }
  size?: "sm" | "md" | "lg" | "xl"
  animation?: "float" | "bounce" | "wiggle" | "pulse"
  showSparkles?: boolean
}

export function AnimatedCharacter({
  character,
  size = "md",
  animation = "float",
  showSparkles = false,
}: AnimatedCharacterProps) {
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

      {/* Glow Effect */}
      <div
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${character.color}40 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
