interface EnhancedBackgroundProps {
  theme?: "sky" | "winter" | "sunset" | "autumn"
  overlay?: boolean
}

export function EnhancedBackground({ theme = "sky", overlay = true }: EnhancedBackgroundProps) {
  const themes = {
    sky: {
      gradient: "bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200",
      overlay: "bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10",
      clouds: "☁️",
      particles: "🐦",
    },
    winter: {
      gradient: "bg-gradient-to-br from-slate-400 via-blue-200 to-white",
      overlay: "bg-gradient-to-br from-blue-600/10 via-slate-500/5 to-white/10",
      clouds: "❄️",
      particles: "🌨️",
    },
    sunset: {
      gradient: "bg-gradient-to-br from-orange-400 via-pink-300 to-purple-200",
      overlay: "bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-purple-500/10",
      clouds: "🌅",
      particles: "✨",
    },
    autumn: {
      gradient: "bg-gradient-to-br from-orange-400 via-yellow-300 to-green-200",
      overlay: "bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-green-500/10",
      clouds: "🍂",
      particles: "🍃",
    },
  }

  const currentTheme = themes[theme]

  return (
    <div className={`absolute inset-0 ${currentTheme.gradient}`}>
      {/* Soft overlay for depth */}
      {overlay && <div className={`absolute inset-0 ${currentTheme.overlay}`} />}

      {/* Background Layer */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float drop-shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {currentTheme.clouds}
          </div>
        ))}
      </div>

      {/* Foreground Particles */}
      <div className="absolute inset-0 opacity-15">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-bounce drop-shadow-md"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 1}s`,
            }}
          >
            {currentTheme.particles}
          </div>
        ))}
      </div>

      {/* Subtle gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
    </div>
  )
}
