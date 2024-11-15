import type { Config } from "tailwindcss";
import animations from '@midudev/tailwind-animations';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'custom-bg': '#1C252E',
      },
      keyframes: {
        'gradient-rotate': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rotateY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'gradient-rotate': 'gradient-rotate 3s ease infinite',
        fadeIn: 'fadeIn 1s ease-in-out',
        'rotate-y': 'rotateY 1s ease-in-out',
        pulsing: 'pulsing 1s infinite', // Set animation to repeat infinitely
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
