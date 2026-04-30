import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#faf8f5',
          surface: '#f5efe5',
          border: '#e8e0d5',
          muted: '#9b8c7c',
          text: '#5c4f3d',
          heading: '#3d3226',
          accent: '#c4a97d',
          tag: '#efe8db',
          'tag-text': '#6b5c47',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      maxWidth: {
        reading: '660px',
      },
    },
  },
  plugins: [typography],
}

export default config
