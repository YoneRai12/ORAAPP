import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'glass-light': 'rgba(255, 255, 255, 0.65)',
        'glass-dark': 'rgba(15, 23, 42, 0.45)'
      },
      backgroundImage: {
        'aurora': 'linear-gradient(135deg, #00b4d8, #7209b7 45%, #ff477e)'
      },
      boxShadow: {
        glass: '0 20px 60px -30px rgba(15, 23, 42, 0.7)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
} satisfies Config;
