import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(222 47% 11%)',
        surface: 'hsl(223 39% 14%)',
        border: 'hsl(217 23% 21%)',
        foreground: 'hsl(210 40% 98%)',
        muted: 'hsl(215 20% 65%)',
        primary: 'hsl(24 95% 56%)',
        secondary: 'hsl(198 93% 60%)',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;