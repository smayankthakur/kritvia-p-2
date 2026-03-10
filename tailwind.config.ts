import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ============================================
           PRIMARY ACCENT - Indigo (#6366F1)
           ============================================ */
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',  // Main primary
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        /* ============================================
           SECONDARY ACCENT - Cyan (#22D3EE)
           ============================================ */
        secondary: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',  // Main secondary
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },
        /* ============================================
           TERTIARY - Violet (#8B5CF6)
           ============================================ */
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        /* ============================================
           SURFACE COLORS (Custom dark theme)
           ============================================ */
        surface: {
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
          4: 'rgb(var(--surface-4) / <alpha-value>)',
        },
        /* ============================================
           DARK THEME SEMANTIC COLORS
           ============================================ */
        dark: {
          bg: '#0A0A0A',
          bgSecondary: '#111111',
          bgTertiary: '#1A1A1A',
          text: '#F8FAFC',
          textSecondary: '#9CA3AF',
          textMuted: '#6B7280',
          border: '#232323',
          card: '#111111',
          cardBorder: '#282828',
        },
        /* ============================================
           LEGACY COMPATIBILITY
           ============================================ */
        accent: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        /* ============================================
           SEMANTIC COLORS
           ============================================ */
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#6366F1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      /* ============================================
         TYPOGRAPHY SCALE
         ============================================ */
      fontSize: {
        // Display
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-2': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-3': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-4': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        // Headings
        'heading-1': ['2.25rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-3': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'heading-4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-5': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'heading-6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        // Body
        'body-xl': ['1.25rem', { lineHeight: '1.75' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      /* ============================================
         SPACING SYSTEM (8px base)
         ============================================ */
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '2': '8px',      /* 0.5rem */
        '3': '12px',
        '4': '16px',     /* 1rem */
        '5': '20px',
        '6': '24px',     /* 1.5rem */
        '7': '28px',
        '8': '32px',     /* 2rem */
        '9': '36px',
        '10': '40px',    /* 2.5rem */
        '11': '44px',
        '12': '48px',    /* 3rem */
        '14': '56px',
        '16': '64px',    /* 4rem */
        '18': '72px',
        '20': '80px',    /* 5rem */
        '24': '96px',    /* 6rem */
        '28': '112px',
        '32': '128px',   /* 8rem */
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',      /* 16px */
          sm: '1.5rem',         /* 24px */
          md: '2rem',           /* 32px */
          lg: '2.5rem',         /* 40px */
          xl: '3rem',           /* 48px */
          '2xl': '4rem',        /* 64px */
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
          '3xl': '1536px',
        },
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        'full': '9999px',
      },
      boxShadow: {
        // Soft shadows
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -3px rgba(0, 0, 0, 0.1), 0 8px 30px -2px rgba(0, 0, 0, 0.06)',
        'hard': '0 10px 40px -3px rgba(0, 0, 0, 0.15)',
        // Glow shadows - Primary
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.5)',
        'glow-sm': '0 0 12px rgba(99, 102, 241, 0.3)',
        // Glow shadows - Secondary (Cyan)
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
        'glow-cyan-lg': '0 0 40px rgba(34, 211, 238, 0.5)',
        // Glow shadows - Violet
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-violet-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
        // Gradient glow
        'glow-gradient': '0 0 30px rgba(99, 102, 241, 0.25), 0 0 60px rgba(34, 211, 238, 0.15)',
        'glow-gradient-lg': '0 0 50px rgba(99, 102, 241, 0.35), 0 0 80px rgba(34, 211, 238, 0.25)',
        // Inner glow
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'screen-2xl': '1400px',
        'screen-3xl': '1536px',
      },
      /* ============================================
         ANIMATIONS
         ============================================ */
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite',
        'gradient': 'gradient 6s ease infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)',
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
