/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        "scale-in": "scaleIn 0.2s ease-out forwards",
      },
      keyframes: {
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
        13: '13',
        14: '14',
        15: '15',
      },
      maxHeight: {
        "notification-list": "400px",
      },
      width: {
        dropdown: "20rem", // w-80
      },
      colors: {
        action: "#f3f4f6",
        "action-hover": "#e5e7eb",
        primary: "#2563eb",
        danger: "#ef4444",
        muted: "#4b5563",
        card: "#e5e7eb",
        "card-hover": "#e5e7eb",
        "card-bg": "#f9fafb",
        "home-sidebar-bg": "#f3f4f6",

        dark: {
          action: "#2a2c2f",
          "action-hover": "#3a3c3f",
          primary: "#60a5fa",
          danger: "#f87171",
          muted: "#d1d5db",
          card: "#27292d",
          "card-hover": "#1a1d21",
          "card-bg": "#1a1d21",
          "home-sidebar-bg": "#000000",
        },
        
        "notification-unread": "#2c2f34",
      },
    },
  },
  plugins: [],
};
