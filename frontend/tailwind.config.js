module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'candy-pink': '#FF69B4',
        'candy-purple': '#9D4EDD',
        'candy-blue': '#3A86FF',
        'candy-yellow': '#FFB703',
        'candy-orange': '#FB5607',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 105, 180, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 105, 180, 0.8)' },
        },
      },
      boxShadow: {
        'candy-sm': '0 4px 6px rgba(157, 78, 221, 0.1)',
        'candy-md': '0 10px 15px rgba(157, 78, 221, 0.2)',
        'candy-lg': '0 20px 25px rgba(157, 78, 221, 0.3)',
        'candy-xl': '0 25px 50px rgba(157, 78, 221, 0.4)',
      },
      backgroundImage: {
        'gradient-candy': 'linear-gradient(135deg, #FF69B4 0%, #9D4EDD 50%, #3A86FF 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FB5607 0%, #FFB703 100%)',
      },
    },
  },
  plugins: [],
}
