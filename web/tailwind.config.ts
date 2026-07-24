import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // Add this if your code lives inside a /src directory!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
