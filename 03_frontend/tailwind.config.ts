import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LINE brand colors as primary palette
        line: {
          green: "#00C300", // LINE primary green
          dark: "#1B1B1B", // LINE dark gray
          gray: "#F4F4F4", // LINE light gray
        },

        // ShareTrust brand colors
        trust: {
          primary: "#00C300",
          secondary: "#0066CC",
          accent: "#FF6B35",
          success: "#00D084",
          warning: "#FFA500",
          danger: "#DC3545",
          info: "#00D4FF",
        },

        // Trust level colors
        trustLevel: {
          level1: "#E5E7EB", // Gray (New user)
          level2: "#FCD34D", // Yellow (Basic trust)
          level3: "#60A5FA", // Blue (Established)
          level4: "#34D399", // Green (Trusted)
          level5: "#F59E0B", // Amber (Highly trusted)
        },

        // Escrow status colors
        escrow: {
          pending: "#FCD34D",
          funded: "#60A5FA",
          released: "#34D399",
          refunded: "#F87171",
        },

        // Extended semantic palette
        semantic: {
          background: "#FFFFFF",
          surface: "#F8FAFC",
          border: "#E2E8F0",
          text: {
            primary: "#1A202C",
            secondary: "#4A5568",
            tertiary: "#718096",
            inverse: "#FFFFFF",
          },
          interactive: {
            primary: "#00C300",
            primaryHover: "#00A300",
            secondary: "#0066CC",
            secondaryHover: "#0052A3",
            disabled: "#CBD5E0",
          },
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      borderRadius: {
        line: "8px", // LINE's rounded corners
        card: "12px",
        dialog: "16px",
      },

      boxShadow: {
        line: "0 2px 8px rgba(0, 0, 0, 0.1)",
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
        dialog: "0 12px 32px rgba(0, 0, 0, 0.12)",
        trust: "0 0 20px rgba(0, 195, 0, 0.2)",
      },

      animation: {
        "pulse-soft": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
        "trust-glow": "trustGlow 2s ease-in-out infinite alternate",
      },

      keyframes: {
        trustGlow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 195, 0, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 195, 0, 0.6)" },
        },
      },

      screens: {
        xs: "375px", // iPhone SE
        sm: "414px", // iPhone Pro
        md: "768px", // iPad mini
        lg: "1024px", // iPad
        xl: "1280px", // Desktop
        "2xl": "1536px", // Large desktop
      },

      backdropBlur: {
        line: "8px",
      },

      zIndex: {
        modal: 1000,
        dropdown: 1010,
        tooltip: 1020,
        notification: 1030,
        loading: 9999,
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
