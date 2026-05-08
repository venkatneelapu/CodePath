/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./Frontend/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./Frontend/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#030712",
        },
      },
      animation: {
        blob: "blob 7s infinite",
        "slide-in-up": "slideInUp 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      animationDelay: {
        2000: "2s",
        4000: "4s",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
