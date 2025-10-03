export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50",
        secondary: "#34495E",
        accent: "#3498DB",
        surface: "#FFFFFF",
        background: "#F8F9FA",
        success: "#27AE60",
        warning: "#F39C12",
        error: "#E74C3C",
        info: "#3498DB",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        balance: "48px",
        h1: "24px",
        h2: "20px",
        body: "16px",
        caption: "14px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};