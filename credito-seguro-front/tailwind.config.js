/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0099FF', 
                    hover: '#007ACC',
                },
                secondary: {
                    DEFAULT: '#6200EE', 
                    hover: '#3700B3',
                },
                accent: '#00E5FF',   
                dark: '#1F2937',      
                light: '#6B7280',     
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}