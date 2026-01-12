const path = require("path")

// get the path of the dependency "@medusajs/ui"
const medusaUI = path.join(
  path.dirname(require.resolve("@medusajs/ui")),
  "**/*.{js,jsx,ts,tsx}"
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", medusaUI],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ui: {
          "button": {
            "inverted": {
              "pressed": {
                "DEFAULT": "rgba(22, 37, 59, 0.9)"
              },
              "hover": {
                "DEFAULT": "rgba(22, 37, 59, 0.9)"
              },
              "DEFAULT": "rgba(22, 37, 59, 1)"
            },
            "transparent": {
              "DEFAULT": "var(--button-transparent)",
              "hover": {
                "DEFAULT": "var(--button-transparent-hover)"
              },
              "pressed": {
                "DEFAULT": "var(--button-transparent-pressed)"
              }
            },
            "danger": {
              "pressed": {
                "DEFAULT": "var(--button-danger-pressed)"
              },
              "DEFAULT": "var(--button-danger)",
              "hover": {
                "DEFAULT": "var(--button-danger-hover)"
              }
            },
            "neutral": {
              "DEFAULT": "var(--button-neutral)",
              "hover": {
                "DEFAULT": "var(--button-neutral-hover)"
              },
              "pressed": {
                "DEFAULT": "var(--button-neutral-pressed)"
              }
            }
          },
        }
      },
    },
  },
  plugins: [],
}
