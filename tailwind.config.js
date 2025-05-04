// tailwind.config.js
const { colors: themeColors, spacing: themeSpacing, fontSizes: themeFontSizes, radii: themeRadii } = require('./src/theme')

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Light mode */
        ...themeColors.light,
        /* Dark mode */
        ...themeColors.dark,
      },
      spacing: {
        xxs: themeSpacing.xxs,
        xs:  themeSpacing.xs,
        sm:  themeSpacing.sm,
        md:  themeSpacing.md,
        lg:  themeSpacing.lg,
        xl:  themeSpacing.xl,
        '2xl': themeSpacing['2xl'],
      },
      fontSize: {
        xs:  themeFontSizes.xs,
        sm:  themeFontSizes.sm,
        base:themeFontSizes.base,
        lg:  themeFontSizes.lg,
        xl:  themeFontSizes.xl,
        '2xl':themeFontSizes['2xl'],
        '3xl':themeFontSizes['3xl'],
        '4xl':themeFontSizes['4xl'],
      },
      borderRadius: {
        sm:    themeRadii.sm,
        md:    themeRadii.md,
        lg:    themeRadii.lg,
        round: themeRadii.round,
      },
      animation: {
        'spin-slow':  'spin 20s linear infinite',
        'pulse-slow': 'pulse 5s ease-in-out infinite',
      },
      transitionDuration: {
        fast:   '150ms',
        normal: '300ms',
        slow:   '500ms',
      },
    },
  },
  plugins: [],
}
