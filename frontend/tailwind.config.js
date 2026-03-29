/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060f",
        nebula: "#0c1228",
        ion: "#22d3ee",
        plasma: "#a78bfa",
        glass: "rgba(20, 28, 48, 0.55)",
      },
      fontFamily: {
        display: ["Orbitron", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(34, 211, 238, 0.25), 0 0 60px rgba(167, 139, 250, 0.15)",
        card: "0 8px 32px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(5,6,15,0) 0%, rgba(5,6,15,1) 70%), linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
