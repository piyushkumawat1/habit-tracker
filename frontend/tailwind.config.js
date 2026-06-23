/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-hover": "hsl(var(--surface-hover) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        
        text: {
          primary: "hsl(var(--text-primary) / <alpha-value>)",
          secondary: "hsl(var(--text-secondary) / <alpha-value>)",
          tertiary: "hsl(var(--text-tertiary) / <alpha-value>)",
        },
        
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          hover: "hsl(var(--brand-hover) / <alpha-value>)",
          soft: "hsl(var(--brand-soft))",
        },
        
        energy: {
          DEFAULT: "hsl(var(--energy) / <alpha-value>)",
          hover: "hsl(var(--energy-hover) / <alpha-value>)",
          soft: "hsl(var(--energy-soft))",
        },
        
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          soft: "hsl(var(--success-soft))",
        },
        
        freeze: {
          DEFAULT: "hsl(var(--freeze) / <alpha-value>)",
          soft: "hsl(var(--freeze-soft))",
        },
        
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          soft: "hsl(var(--destructive-soft))",
        },

        // Legacy mappings (so Shadcn components like CustomSelect using `border-input` or `bg-card` don't completely break, we map them to our new variables)
        input: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--brand) / <alpha-value>)",
        background: "hsl(var(--bg) / <alpha-value>)",
        foreground: "hsl(var(--text-primary) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          foreground: "hsl(var(--text-primary) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          foreground: "hsl(var(--text-primary) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-hover) / <alpha-value>)",
          foreground: "hsl(var(--text-secondary) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--brand-soft))",
          foreground: "hsl(var(--brand) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          foreground: "hsl(var(--text-primary) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          foreground: "hsl(var(--text-primary) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
    },
  },
  plugins: [],
}
