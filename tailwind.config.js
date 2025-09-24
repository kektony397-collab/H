
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Rajdhani', 'sans-serif'],
        'display': ['Orbitron', 'sans-serif'],
      },
      colors: {
        'slate-950': '#020617',
        'brand-cyan': {
          '100': '#cffafe',
          '200': '#a5f3fc',
          '300': '#67e8f9',
          '400': '#22d3ee',
          '500': '#06b6d4',
          '600': '#0891b2',
          '700': '#0e7490',
          '800': '#155e75',
          '900': '#164e63',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4), 0 0 5px rgba(6, 182, 212, 0.6)',
      },
       keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.7', boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 20px rgba(6, 182, 212, 0.7)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
