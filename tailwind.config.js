/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        Roboto: ["Roboto", "sans-serif"],
        RobotoBold: ["Roboto-Bold", "sans-serif"],
        RobotoLight: ["Roboto-Light", "sans-serif"],
        RobotoRegular: ["Roboto-Regular", "sans-serif"],
        RobotoSemibold: ["Roboto-SemiBold", "sans-serif"]
      },
      colors: {
        pink: "#f065a6",
        darkPink: "#df1b7d",
        acqua: "#018bba",
        acquaBlue: "#009cd9",
        darkBlue: "#043a68",
        cgreen: "#7a9b44",
        cyellow: "#ebbc16",
        acquaGreen: "#008c96",
        cbrown: "#5e5e5e"
      }
    },
  },
  plugins: [],
}

