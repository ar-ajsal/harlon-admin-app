/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 preset
  presets: [require('nativewind/preset')],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5B4AE8',
          light: '#7C6FF0',
          dark: '#3D2EC4',
          muted: '#2D2560',
        },
      },
    },
  },
  plugins: [],
};
