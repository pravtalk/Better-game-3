import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        sans: ["Nunito", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced UI colors for better visibility
        "ui-card": "#f7f7f7",
        "ui-card-light": "#fafafa",
        "ui-border": "#e0e0e0",
        "ui-border-light": "#eeeeee",
        "ui-text-primary": "#1a1a1a",
        "ui-text-secondary": "#4a4a4a",
        "ui-text-muted": "#6b7280",
        // GLA colors
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 235, 59, 0.3), 0 0 40px rgba(255, 235, 59, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(255, 235, 59, 0.5), 0 0 60px rgba(255, 235, 59, 0.2)",
          },
        },
        "soft-glow": {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(139, 69, 19, 0.2), 0 0 30px rgba(139, 69, 19, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(139, 69, 19, 0.3), 0 0 50px rgba(139, 69, 19, 0.15)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        bounce: "bounce 2s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        spin: "spin 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "soft-glow": "soft-glow 3s ease-in-out infinite",
      },
      boxShadow: {
        "ui-card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "ui-card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "ui-button": "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
        "ui-button-hover": "0 6px 20px rgba(0, 0, 0, 0.15)",
        "glow-yellow": "0 0 20px rgba(255, 235, 59, 0.4)",
        "glow-soft": "0 0 15px rgba(139, 69, 19, 0.3)",
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.4)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
