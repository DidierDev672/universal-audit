// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-6px) rotate(4deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-5px) rotate(-3deg)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-4px) rotate(2deg)' },
        },
      },
      animation: {
        'float-slow':   'floatSlow 5s ease-in-out infinite',
        'float-medium': 'floatMedium 3.5s ease-in-out infinite',
        'float-fast':   'floatFast 2.8s ease-in-out infinite',
      },
    },
  },
}