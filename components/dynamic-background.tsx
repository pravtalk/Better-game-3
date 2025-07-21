interface DynamicBackgroundProps {
  theme: "winter" | "sky" | "sunset" | "autumn"
}

export default function DynamicBackground({ theme }: DynamicBackgroundProps) {
  const themes = {
    winter: {
      gradient: "bg-gradient-to-b from-slate-600 via-slate-400 to-white",
      elements: ["❄️", "🏔️", "🌨️", "⛄"],
      colors: ["text-blue-200", "text-white", "text-slate-300"],
    },
    sky: {
      gradient: "bg-gradient-to-b from-sky-500 via-sky-300 to-blue-200",
      elements: ["☁️", "🐦", "✈️", "🌤️"],
      colors: ["text-white", "text-blue-100", "text-sky-200"],
    },
    sunset: {
      gradient: "bg-gradient-to-b from-orange-500 via-pink-400 to-purple-300",
      elements: ["🌅", "🏙️", "✨", "🌆"],
      colors: ["text-orange-200", "text-pink-200", "text-purple-200"],
    },
    autumn: {
      gradient: "bg-gradient-to-b from-orange-600 via-yellow-400 to-green-300",
      elements: ["🍂", "🍃", "🌳", "🦋"],
      colors: ["text-orange-300", "text-yellow-300", "text-green-300"],
    },
  }

  const currentTheme = themes[theme]

  return (
    <div className={`absolute inset-0 ${currentTheme.gradient}`}>
      {/* Background Layer */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`bg-${i}`}
            className={`absolute text-4xl animate-float ${currentTheme.colors[i % currentTheme.colors.length]}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {currentTheme.elements[i % currentTheme.elements.length]}
          </div>
        ))}
      </div>

      {/* Foreground Layer */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`fg-${i}`}
            className={`absolute text-2xl animate-bounce ${currentTheme.colors[i % currentTheme.colors.length]}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {currentTheme.elements[(i + 1) % currentTheme.elements.length]}
          </div>
        ))}
      </div>
    </div>
  )
}
