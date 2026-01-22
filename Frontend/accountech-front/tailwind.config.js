/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "account-blue": "#0070f3",
        "account-cyan": "#0891b2",
      },
    },
  },
  plugins: [],
};
