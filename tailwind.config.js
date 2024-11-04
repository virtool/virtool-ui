export default {
    content: ["./src/js/**/*.{html,js,jsx,ts,tsx}"],
    prefix: "",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#3C8786",
                    dark: "#2B6E74",
                    darkest: "#1E5661",
                    light: "#6AB7AF",
                    lightest: "#E8F5F5",
                },
            },
            keyframes: {
                overlayShow: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                contentShow: {
                    from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
                    to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
                },
                slideDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideDown: "slideDown 100ms ease-in",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
