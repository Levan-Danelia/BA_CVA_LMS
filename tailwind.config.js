/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Brand - Base color for UI
                primary: {
                    DEFAULT: '#328cc1',  // Blue - base color for sections, borders, icons
                },

                // Chart Palette - 5-color palette for data visualization only
                chart: {
                    1: '#292866',    // Deep purple
                    2: '#406352',    // Forest green
                    3: '#F05C4F',    // Coral red
                    4: '#C8C2E0',    // Lavender
                    5: '#97D0B1',    // Mint green
                },

                // Card Palette - Calm, moderate colors for UI cards
                'card-color': {
                    1: '#7B9CC4',    // Soft sky blue
                    2: '#6B9B8E',    // Sage green
                    3: '#9B86BD',    // Soft purple
                    4: '#5A8FAE',    // Ocean blue
                    5: '#8BA888',    // Muted green
                    6: '#8E7DAB',    // Dusty purple
                },

                // Neutral palette - consistent slate-based
                neutral: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                    600: '#475569',
                    500: '#64748b',
                    400: '#94a3b8',
                    300: '#cbd5e1',
                    200: '#e2e8f0',
                    100: '#f1f5f9',
                    50: '#f8fafc',
                },

                // Shadcn-compatible tokens (using CSS variables)
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            fontSize: {
                'micro': ['9px', { lineHeight: '1.2' }],
                'tiny': ['10px', { lineHeight: '1.3' }],
                'xs': ['11px', { lineHeight: '1.4' }],
                'sm': ['12px', { lineHeight: '1.5' }],
                'base': ['13px', { lineHeight: '1.6' }],
                'md': ['14px', { lineHeight: '1.6' }],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
            },
        },
    },
    plugins: [],
}
