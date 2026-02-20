/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // B端 商务高洁色系
        business: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // 主推青绿
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a', // 藏青藏绿
        },
        // C端 银发温暖色系
        elder: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b', // 温暖橙黄
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
        }
      },
      fontSize: {
        // 适老化核心：起步字号加大
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
      }
    },
  },
  plugins: [],
}

