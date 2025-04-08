/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // ✅ Ensure your app folder is included
    "./components/**/*.{js,jsx,ts,tsx}", // ✅ Ensure component folder is included
  ],
  presets: [require("nativewind/preset")], // ✅ Required for NativeWind
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik-Regular', 'sans-serif'],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-semibold": ["Rubik-Semibold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
      },
      colors: {
        "primary": "#ED332D",
        "secondary": "#2E2E2E",
      },
    },
  },
  plugins: [],
};
