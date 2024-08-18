import type { Config } from "tailwindcss";

// https://tailwindcss.com/docs/configuration
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: "1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
        "-sm": { max: "640px" },
        // => @media (max-width: 640px) { ... }
        "-md": { max: "768px" },
        // => @media (max-width: 768px) { ... }
        "-lg": { max: "1024px" },
        // => @media (max-width: 1024px) { ... }
        "-xl": { max: "1280px" },
        // => @media (max-width: 1280px) { ... }
        "-2xl": { max: "1536px" },
        // => @media (max-width: 1536px) { ... }
      },
      colors: {
        whiteish: "#d8d4cf",
        blackish: "#131516",
      },
    },
  },
  plugins: [],
} satisfies Config;
