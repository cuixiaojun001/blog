import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          heading: 'rgb(var(--color-heading) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          tag: 'rgb(var(--color-tag) / <alpha-value>)',
          'tag-text': 'rgb(var(--color-tag-text) / <alpha-value>)',
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
