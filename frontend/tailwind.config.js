/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#0f766e",
        amberRisk: "#b45309",
        redRisk: "#b91c1c"
      },
      boxShadow: {
        panel: "0 16px 40px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};
