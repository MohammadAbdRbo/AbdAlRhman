module.exports = {
  plugins: [
    require('tailwindcss'),      // ✅ بدون () ← هذا هو السبب
    require('autoprefixer')
  ]
}

