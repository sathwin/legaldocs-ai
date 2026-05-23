/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // OpenHands-inspired palette
        cream: {
          50: "#FDFCFA",
          100: "#F5F1E8",
          200: "#EDE8DD",
          300: "#E5DFD2"
        },
        brown: {
          900: "#1A1512",
          800: "#231F1C",
          700: "#3D3731"
        },
        yellow: {
          brand: "#E8F34D",
          soft: "#F4F382",
          glow: "#FEFF9E"
        },
        // Risk colors adapted to theme
        risk: {
          low: "#4ADE80",
          medium: "#FBBF24",
          high: "#F87171"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "Consolas", "monospace"]
      },
      boxShadow: {
        brutal: "4px 4px 0px rgba(26, 21, 18, 1)",
        soft: "0 2px 8px rgba(26, 21, 18, 0.08)",
        glow: "0 0 40px rgba(232, 243, 77, 0.3)"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 3s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};
