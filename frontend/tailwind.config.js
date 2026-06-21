/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--tw-border) / <alpha-value>)",
        input: "oklch(var(--tw-input) / <alpha-value>)",
        ring: "oklch(var(--tw-ring) / <alpha-value>)",
        background: "oklch(var(--tw-background) / <alpha-value>)",
        foreground: "oklch(var(--tw-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--tw-primary) / <alpha-value>)",
          foreground: "oklch(var(--tw-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--tw-secondary) / <alpha-value>)",
          foreground: "oklch(var(--tw-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--tw-destructive) / <alpha-value>)",
          foreground: "oklch(var(--tw-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--tw-muted) / <alpha-value>)",
          foreground: "oklch(var(--tw-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--tw-accent) / <alpha-value>)",
          foreground: "oklch(var(--tw-accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--tw-popover) / <alpha-value>)",
          foreground: "oklch(var(--tw-popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--tw-card) / <alpha-value>)",
          foreground: "oklch(var(--tw-card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

