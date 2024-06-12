import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/libraries/**/*.{js,ts,jsx,tsx,mdx}',
    './src/@views/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      sm: '560px',
      md: '740px',
      lg: '1024px',
      xl: '1300px',
      '2xl': '1536px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1rem',
        lg: '1rem',
        xl: '1rem',
        '2xl': '1rem'
      },
      screens: {
        sm: '560px',
        md: '740px',
        lg: '1024px',
        xl: '1300px',
        '2xl': '1536px'
      }
    },
    fontFamily: {
      primary: 'var(--font-primary)'
    },
    colors: {
      // default
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',

      // theme
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
      tertiary: 'var(--tertiary-color)',
      white: 'var(--white)',
      dark: 'var(--dark)',
      success: 'var(--success)',
      info: 'var(--info)',
      danger: {
        DEFAULT: 'var(--danger)',
        100: 'var(--danger-100)',
        200: 'var(--danger-200)'
      },
      warning: {
        DEFAULT: 'var(--warning)',
        100: 'var(--warning-100)'
      },

      'text-primary': 'var(--color-primary)',
      'text-secondary': 'var(--color-secondary)',
      'text-tertiary': 'var(--color-tertiary)',
      'text-brand': 'var(--color-brand)',
      'text-invert': 'var(--color-invert)',
      'text-error': 'var(--color-error)',
      'text-success': 'var(--color-success)',
      'text-accent': 'var(--color-accent)',

      gray: {
        DEFAULT: 'var(--color-gray-0)',
        100: 'var(--color-gray-100)',
        200: 'var(--color-gray-200)'
      },

      'blue-cheese': {
        DEFAULT: 'var(--blue-cheese-pressed-color)',
        hover: 'var(--blue-cheese-hover-color)',
        active: 'var(--blue-cheese-active-color)',
        'hover-bg': 'var(--blue-cheese-hover-background)',
        'active-bg': 'var(--blue-cheese-active-background)',
        pressed: 'var(--blue-cheese-pressed-color)'
      },
      avocado: {
        DEFAULT: 'var(--avocado-pressed-color)',
        hover: 'var(--avocado-hover-color)',
        active: 'var(--avocado-active-color)',
        'hover-bg': 'var(--avocado-hover-background)',
        'active-bg': 'var(--avocado-active-background)',
        pressed: 'var(--avocado-pressed-color)'
      },
      bun: {
        DEFAULT: 'var(--bun-pressed-color)',
        hover: 'var(--bun-hover-color)',
        active: 'var(--bun-active-color)',
        'hover-bg': 'var(--bun-hover-background)',
        'active-bg': 'var(--bun-active-background)',
        pressed: 'var(--bun-pressed-color)'
      },
      cabbage: {
        DEFAULT: 'var(--cabbage-pressed-color)',
        hover: 'var(--cabbage-hover-color)',
        active: 'var(--cabbage-active-color)',
        'hover-bg': 'var(--cabbage-hover-background)',
        'active-bg': 'var(--cabbage-active-background)',
        pressed: 'var(--cabbage-pressed-color)'
      },
      ketchup: {
        DEFAULT: 'var(--ketchup-pressed-color)',
        hover: 'var(--ketchup-hover-color)',
        active: 'var(--ketchup-active-color)',
        'hover-bg': 'var(--ketchup-hover-background)',
        'active-bg': 'var(--ketchup-active-background)',
        pressed: 'var(--ketchup-pressed-color)'
      }
    },
    extend: {
      width: {
        '0.5': '0.125rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem'
      },
      height: {
        '0.5': '0.125rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem'
      },
      spacing: {
        '0.5': '0.125rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem'
      },
      borderWidth: {
        1.5: '1.5px'
      },
      borderRadius: {
        '4xl': '2.25rem'
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
};
export default config;
