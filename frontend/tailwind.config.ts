import type { Config } from 'tailwindcss';

/**
 * Design tokens. Brand: Gold #D4AF37 on true Black #000000.
 * Neutral steps are for elevation only (no tinted near-blacks).
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        surface: '#0f0f0f',
        raised: '#171717',
        line: '#2a2a2a',
        gold: { DEFAULT: '#D4AF37', soft: '#E6C862', deep: '#9C7E1E', wash: 'rgba(212,175,55,0.12)' },
        bone: '#F3EFE4',
        muted: '#A8A8A8',
        dim: '#7d7d7d',
        danger: '#FF6B6B',
        ok: '#5BD68A',
      },
      fontFamily: {
        display: ['"Montserrat Variable"', 'Montserrat', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.6rem, 6.2vw, 5.75rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-lg': ['clamp(2.1rem, 4.4vw, 3.9rem)', { lineHeight: '1.02', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(1.6rem, 2.6vw, 2.4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '650' }],
      },
      maxWidth: { shell: '80rem' },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        sweep: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(100%)' } },
        pulseRing: { '0%': { transform: 'scale(.8)', opacity: '.7' }, '100%': { transform: 'scale(2)', opacity: '0' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both',
        sweep: 'sweep 1.6s ease-in-out infinite',
        pulseRing: 'pulseRing 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
