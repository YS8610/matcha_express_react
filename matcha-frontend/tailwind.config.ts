import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          950: '#0c2618',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          150: '#ebebeb',
          200: '#e5e5e5',
          250: '#d6d6d6',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          750: '#2d3748',
          800: '#1f2937',
          850: '#1a202c',
          900: '#111827',
          950: '#0f172a',
        },
        success: {
          light: '#e8f5e9',
          dark: '#1b5e20',
          bg: '#e8f5e9',
          text: '#1b5e20',
        },
        warning: {
          light: '#fff3e0',
          dark: '#e65100',
          bg: '#fff3e0',
          text: '#e65100',
        },
        error: {
          light: '#ffebee',
          dark: '#b71c1c',
          bg: '#ffebee',
          text: '#b71c1c',
        },
        info: {
          light: '#e3f2fd',
          dark: '#0d47a1',
          bg: '#e3f2fd',
          text: '#0d47a1',
        },
        brand: {
          green: '#558b2f',
          'green-hover': '#3d6620',
          lime: '#9ccc65',
          'lime-hover': '#7ab34f',
        },
      },
      fontFamily: {
        geist_sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        geist_mono: ['var(--font-geist-mono)', 'monospace'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        px: '1px',
        0: '0px',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },
      borderRadius: {
        none: '0px',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 1px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        none: 'none',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
        slideInUp: 'slideInUp 0.4s ease-out',
        slideInDown: 'slideInDown 0.4s ease-out',
        slideInLeft: 'slideInLeft 0.4s ease-out',
        slideInRight: 'slideInRight 0.4s ease-out',
        slideOutUp: 'slideOutUp 0.3s ease-in',
        slideOutDown: 'slideOutDown 0.3s ease-in',
        slideOutLeft: 'slideOutLeft 0.3s ease-in',
        slideOutRight: 'slideOutRight 0.3s ease-in',

        scaleIn: 'scaleIn 0.3s ease-out',
        scaleOut: 'scaleOut 0.2s ease-in',

        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
        bounce: 'bounce 1s infinite',

        shimmer: 'shimmer 2s infinite',

        wiggle: 'wiggle 0.6s ease-in-out',
        shake: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        heartbeat: 'heartbeat 1.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',

        focusPulse: 'focusPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        slideOutDown: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        slideOutLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-10px)' },
        },
        slideOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(10px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        focusPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(85, 139, 47, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(85, 139, 47, 0)' },
        },
      },
      transitionDuration: {
        0: '0ms',
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        250: '250ms',
        300: '300ms',
        350: '350ms',
        400: '400ms',
        500: '500ms',
        600: '600ms',
        700: '700ms',
        800: '800ms',
        900: '900ms',
        1000: '1000ms',
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        base: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      },
      backdropFilter: {
        blur: 'blur(10px)',
        saturate: 'saturate(2)',
      },
      opacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        25: '0.25',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        75: '0.75',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1',
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }: { addComponents: Function, theme: Function }) {
      addComponents({
        '.btn': {
          '@apply px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-primary': {
          '@apply btn bg-brand-green text-white hover:bg-brand-green-hover active:scale-95': {},
        },
        '.btn-primary-dark': {
          '@apply btn bg-brand-lime text-gray-950 hover:bg-brand-lime-hover active:scale-95': {},
        },
        '.btn-secondary': {
          '@apply btn border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800': {},
        },
        '.btn-ghost': {
          '@apply btn text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': {},
        },
        '.btn-danger': {
          '@apply btn bg-red-600 text-white hover:bg-red-700 active:scale-95': {},
        },
        '.btn-success': {
          '@apply btn bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95': {},
        },

        '.card': {
          '@apply bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 shadow-sm hover:shadow-md': {},
        },
        '.card-lg': {
          '@apply card p-6': {},
        },
        '.card-interactive': {
          '@apply card cursor-pointer hover:border-gray-300 dark:hover:border-gray-600': {},
        },

        '.input': {
          '@apply w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200': {},
        },
        '.input-focus': {
          '@apply focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-0 dark:focus:ring-brand-lime': {},
        },
        '.input-error': {
          '@apply border-red-500 focus:ring-red-500': {},
        },

        '.text-subtle': {
          '@apply text-gray-600 dark:text-gray-400': {},
        },
        '.text-muted': {
          '@apply text-gray-500 dark:text-gray-500': {},
        },

        '.badge': {
          '@apply inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-success': {
          '@apply badge bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200': {},
        },
        '.badge-warning': {
          '@apply badge bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200': {},
        },
        '.badge-error': {
          '@apply badge bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': {},
        },
        '.badge-info': {
          '@apply badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': {},
        },
      });
    },
  ],
};

export default config;
