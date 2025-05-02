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
    },
  },
  plugins: [require('tailwind-scrollbar')],
}

// default font of website then add font in file index.css
