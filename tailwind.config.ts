import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '2160px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-inconsolata)'],
      },
      colors: {
        'high-power-rounds': '#c54dfe',
        'impact-rounds': '#21ba08',
        'special-rounds': '#e47121',
        electric: '#36c6f2',
        toxic: '#40c41d',
      },
      boxShadow: {
        outline: '0 0 12px',
      },
      height: {
        inherit: 'inherit',
      },
      textShadow: {
        'black-outline': `1px 1px 0 black,
          -1px 1px 0 black,
          -1px -1px 0 black,
          1px -1px 0 black`,
        outline: `1px 1px 0 var(--tw-shadow-color),
        -1px 1px 0 var(--tw-shadow-color),
        -1px -1px 0 var(--tw-shadow-color),
        1px -1px 0 var(--tw-shadow-color)`
      },
      borderWidth: {
        '1': '1px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), 
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            '--tw-shadow-color': theme('shadow.color'),
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};
