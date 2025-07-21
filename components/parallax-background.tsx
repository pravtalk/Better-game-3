interface ParallaxBackgroundProps {
  theme?: "sky" | "winter" | "sunset" | "autumn"
}

export function ParallaxBackground({ theme = "sky" }: ParallaxBackgroundProps) {
  const themes = {
    sky: {
      gradient: "bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200",
      clouds: "☁️",
      particles: "🐦",
    },
    winter: {
      gradient: "bg-gradient-to-b from-slate-400 via-slate-300 to-white",
      clouds: "❄️",
      particles: "🌨️",
    },
    sunset: {
      gradient: "bg-gradient-to-b from-orange-400 via-pink-300 to-purple-200",
      clouds: "🌅",
      particles: "✨",
    },
    autumn: {
      gradient: "bg-gradient-to-b from-orange-400 via-yellow-300 to-green-200",
      clouds: "🍂",
      particles: "🍃",
    },
  }

  const currentTheme = themes[theme]

  return (
    <div className={`absolute inset-0 ${currentTheme.gradient}`}>
      {/* Background Layer */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
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
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-bounce"
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
    </div>
  )
}
