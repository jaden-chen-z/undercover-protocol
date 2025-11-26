/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          // 配置代码中用到的 Space Mono 字体
          mono: ['"Space Mono"', 'monospace'], 
        },
      },
    },
    plugins: [],
