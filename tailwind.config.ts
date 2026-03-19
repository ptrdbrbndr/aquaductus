import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mist: '#E8EDF0',
        water: '#4A7FA5',
        'water-deep': '#2C5F7A',
        sand: '#C4A882',
        'sand-light': '#F5EFE6',
        'text-primary': '#2D3748',
        'text-light': '#718096',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
