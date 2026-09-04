import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
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
        device: {
          body: "hsl(var(--device-body))",
          "body-light": "hsl(var(--device-body-light))",
        },
        display: {
          DEFAULT: "hsl(var(--display-bg))",
          warm: "hsl(var(--display-bg-warm))",
          text: "hsl(var(--display-text))",
          glow: "hsl(var(--display-glow))",
        },
        walkie: {
          button: "hsl(var(--button-surface))",
          "button-hover": "hsl(var(--button-surface-hover))",
          "button-active": "hsl(var(--button-active))",
        },
        ptt: {
          glow: "hsl(var(--ptt-glow))",
          ring: "hsl(var(--ptt-ring))",
        },
        status: {
          ready: "hsl(var(--status-ready))",
          searching: "hsl(var(--status-searching))",
          off: "hsl(var(--status-off))",
        },
        mode: {
          bluetooth: "hsl(var(--mode-bluetooth))",
          "wifi-direct": "hsl(var(--mode-wifi-direct))",
          internet: "hsl(var(--mode-internet))",
        },
        drawer: {
          bg: "hsl(var(--drawer-bg))",
          overlay: "hsl(var(--drawer-overlay))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.08)", opacity: "0.8" },
        },
        "mic-pulse": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "breathe": "breathe 3s ease-in-out infinite",
        "mic-pulse": "mic-pulse 0.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
