import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        neumorphism: {
          primary: "#1E3A8A",
          secondary: "#1E40AF",
          accent: "#1E3A8A",
          neutral: "#1E40AF",
          natural: "#c0c0c0",
          "base-100": "#c0c0c0",
          "base-200": "#d4d4d4",
          "base-300": "#a8a8a8",
          "base-content": "#2c2c2c",
          info: "#1E3A8A",
          success: "#4caf50",
          warning: "#ff9800",
          error: "#f44336",
        },
        mytheme: {
          primary: "#1E3A8A",
          secondary: "#1E40AF",
          accent: "#1E3A8A",
          neutral: "#1E40AF",
          natural: "#1E3A8A",
          "base-100": "#d4d4d4",
          info: "#1E3A8A",
          success: "#2CC98F",
          warning: "#FBC337",
          error: "#F76464",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    // Custom neumorphism plugin
    function({ addUtilities }: any) {
      const newUtilities = {
        '.neu-raised': {
          'background': 'var(--bg-raised)',
          'border-radius': '20px',
          'box-shadow': '8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)',
        },
        '.neu-pressed': {
          'background': 'var(--bg-pressed)',
          'border-radius': '20px',
          'box-shadow': 'inset 8px 8px 16px var(--shadow-inset-dark), inset -8px -8px 16px var(--shadow-inset-light)',
        },
        '.neu-soft': {
          'background': 'var(--bg-card)',
          'border-radius': '16px',
          'box-shadow': '6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light)',
        },
        '.neu-inset': {
          'background': 'var(--bg-primary)',
          'border-radius': '12px',
          'box-shadow': 'inset 4px 4px 8px var(--shadow-inset-dark), inset -4px -4px 8px var(--shadow-inset-light)',
        },
        '.neu-base': {
          'background': 'var(--bg-primary)',
          'border-radius': '20px',
        },
        '.neu-card': {
          'background': 'var(--bg-card)',
          'border-radius': '20px',
          'padding': '24px',
          'box-shadow': '8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)',
          'border': '1px solid var(--border-light)',
        },
        '.neu-card-small': {
          'background': 'var(--bg-card)',
          'border-radius': '16px',
          'padding': '16px',
          'box-shadow': '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)',
          'border': '1px solid var(--border-light)',
        },
        '.neu-button': {
          'background': 'var(--bg-raised)',
          'border': 'none',
          'border-radius': '16px',
          'padding': '12px 24px',
          'cursor': 'pointer',
          'transition': 'all 0.2s ease',
          'box-shadow': '6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light)',
        },
        '.neu-button:hover': {
          'transform': 'translateY(-1px)',
          'box-shadow': '8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)',
        },
        '.neu-button:active': {
          'transform': 'translateY(0)',
          'box-shadow': 'inset 4px 4px 8px var(--shadow-inset-dark), inset -4px -4px 8px var(--shadow-inset-light)',
        },
        '.neu-input': {
          'background': 'var(--bg-primary)',
          'border': 'none',
          'border-radius': '12px',
          'padding': '16px',
          'outline': 'none',
          'transition': 'all 0.2s ease',
          'box-shadow': 'inset 4px 4px 8px var(--shadow-inset-dark), inset -4px -4px 8px var(--shadow-inset-light)',
        },
        '.neu-input:focus': {
          'box-shadow': 'inset 6px 6px 12px var(--shadow-inset-dark), inset -6px -6px 12px var(--shadow-inset-light)',
        },
        '.neu-text-primary': {
          'color': 'var(--text-primary)',
          'font-weight': '600',
        },
        '.neu-text-secondary': {
          'color': 'var(--text-secondary)',
          'font-weight': '500',
        },
        '.neu-text-muted': {
          'color': 'var(--text-muted)',
          'font-weight': '400',
        },
        '.neu-loading': {
          'background': 'var(--bg-primary)',
          'border-radius': '12px',
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.neu-loading::after': {
          'content': '""',
          'position': 'absolute',
          'top': '0',
          'left': '-100%',
          'width': '100%',
          'height': '100%',
          'background': 'linear-gradient(90deg, transparent, var(--shadow-light), transparent)',
          'animation': 'neu-loading-shimmer 1.5s infinite',
        },
      }
      
      addUtilities(newUtilities, ['responsive', 'hover', 'active', 'focus'])
    },
  ],
};
export default config;
