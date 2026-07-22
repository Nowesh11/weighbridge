import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B1F27",
        graphite: {
          900: "#14171C",
          800: "#20242C",
          700: "#2B3038",
        },
        steel: {
          50: "#F7F8FA",
          100: "#EEF1F4",
          200: "#E3E7EC",
          300: "#CBD2DA",
        },
        line: "#D8DCE2",
        amber: {
          500: "#E8A33D",
          600: "#CE8A28",
        },
        signal: {
          green: "#3E8E5A",
          red: "#C1503F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
