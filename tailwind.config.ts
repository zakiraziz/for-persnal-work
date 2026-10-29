import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090D18",
        sidebar: "#0C1120",
        surface: "#101729",
        accent: "#8B5CF6",
        blue: "#2563EB",
      },
    },
  },
  plugins: [],
};

export default config;
