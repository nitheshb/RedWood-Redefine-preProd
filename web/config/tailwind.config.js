module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Playfair: ['Playfair Display', 'serif'],
        // bodyLato: ['Lato', 'sans-serif'],
        montF: ['Montserrat', 'sans-serif'],
        rubikF: ['Rubik', 'sans-serif'],
        nunF: ['Nunito Sans', 'sans-serif'],
        sanF: ['Public Sans', 'sans-serif'],
        interF: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },



   


      // animation: {
      //   'border-spin': 'border-spin 60s linear infinite',
      // },
      // keyframes: {
      //   'border-spin': {
      //     '0%': { transform: 'rotate(0deg)' },
      //     '100%': { transform: 'rotate(360deg)' },
      //   },
      // },

    


    },
  },
  plugins: [require('tailwind-scrollbar')],
}

// default font of website then add font in file index.css



