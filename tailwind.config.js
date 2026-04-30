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
        wave1: {
          '0%, 100%': { d: 'path("M0,20 C60,35 120,5 180,20 C240,35 300,5 360,20 C380,26 390,28 400,20 L400,40 L0,40 Z")' },
          '50%': { d: 'path("M0,28 C50,15 110,38 170,25 C230,12 290,36 350,24 C370,19 385,21 400,26 L400,40 L0,40 Z")' },},
          wave2: {
            '0%, 100%': { d: 'path("M0,28 C50,15 110,38 170,25 C230,12 290,36 350,24 C370,19 385,21 400,26 L400,40 L0,40 Z")' },
            '50%': { d: 'path("M0,22 C50,34 110,14 170,30 C230,44 290,18 350,32 C370,36 385,34 400,22 L400,40 L0,40 Z")' },
          }
      },
      animation: {
        'float-slow':   'floatSlow 5s ease-in-out infinite',
        'float-medium': 'floatMedium 3.5s ease-in-out infinite',
        'float-fast':   'floatFast 2.8s ease-in-out infinite',
        'wave-1': 'wave1 6s ease-in-out infinite',
        'wave-2': 'wave2 6s ease-in-out infinite'
      },
    },
  },
}