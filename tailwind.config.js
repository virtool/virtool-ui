export default {
    content: ["./src/js/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            keyframes: {
                slideDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                slideDown: "slideDown 100ms ease-in",
            },
        },
    },
    plugins: [],
};
