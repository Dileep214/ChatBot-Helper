/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                hospital: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7cc7fb',
                    400: '#38a9f8',
                    500: '#0e8de9',
                    600: '#026fc5',
                    700: '#03589f',
                    800: '#074b83',
                    900: '#0c3f6d',
                    dark: '#1e293b',
                    accent: '#fbbf24', // Warm yellow for friendly accents
                    emergency: '#ef4444',
                },
            },
            fontFamily: {
                sans: ['Quicksand', 'Inter', 'sans-serif'],
            },
            animation: {
                'bounce-subtle': 'bounce-subtle 2s infinite',
            },
            keyframes: {
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
                    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
                }
            }
        },
    },
    plugins: [],
}
