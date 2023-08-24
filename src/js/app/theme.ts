import { get } from "lodash-es";
import { DefaultTheme } from "styled-components";

/**
 * The default theme and supporting functions
 *
 * @module app/theme
 */

/**
 * The default named sizes for theme elements
 */
export enum sizes {
    xs = "xs",
    sm = "sm",
    md = "md",
    lg = "lg",
    xl = "xl",
    xxl = "xxl",
}

/**
 * The default theme for the UI
 */
export const theme: DefaultTheme = {
    borderRadius: {
        sm: "3px",
        md: "6px",
        lg: "10px",
    },
    boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        input: "inset 0 1px 1px rgba(0, 0, 0, 0.075);",
        inset: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    },
    color: {
        black: "#000000",
        blue: "#0B7FE5",
        blueDark: "#0862C4",
        blueDarkest: "#033384",
        blueLight: "#6AC4F7",
        blueLightest: "#CDF1FD",
        green: "#1DAD57",
        greenDark: "#159455",
        greenDarkest: "#096449",
        greenLight: "#73E68A",
        greenLightest: "#D1FAD1",
        grey: "#A0AEC0",
        greyDark: "#718096",
        greyDarkest: "#4A5568",
        greyLight: "#CBD5E0",
        greyLightest: "#EDF2F7",
        greyHover: "#F7FAFC",
        orange: "#F7A000",
        orangeLight: "#FCD265",
        orangeLightest: "#FEF4CB",
        orangeDark: "#D48100",
        orangeDarkest: "#B16600",
        primary: "#3C8786",
        primaryDark: "#2B6E74",
        primaryDarkest: "#1E5661",
        primaryLight: "#6AB7AF",
        primaryLightest: "#E8F5F5",
        purple: "#9F7AEA",
        purpleDark: "#805AD5",
        purpleDarkest: "#553C9A",
        purpleLight: "#D6BCFA",
        purpleLightest: "#FAF5FF",
        red: "#E0282E",
        redDark: "#C01D30",
        redDarkest: "#A11431",
        redLight: "#F58E7C",
        redLightest: "#FDE1D3",
        white: "#fff",
        yellow: "#FFE030",
        yellowLight: "#FFF082",
        yellowLightest: "#FFFBD5",
        yellowDark: "#DBBC23",
        yellowDarkest: "#B79A18",
    },
    fontFamily: {
        monospace: "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
    },
    fontSize: {
        xs: "10px",
        sm: "12px",
        md: "14px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
    },
    fontWeight: {
        normal: 400,
        thick: 500,
        bold: 700,
    },
    gap: {
        column: "15px",
        text: "5px",
    },
    ring: {
        sm: "0 0 0 2px",
        md: "0 0 0 5px",
    },
};

/**
 * CSS for rendering a solid ring around an element
 *
 * @param color - the color of the ring
 * @returns a callable for formatting a solid ring of the correct color
 */
export function getRing(color: string) {
    return ({ theme }: { theme: DefaultTheme }) => `${theme.ring.sm} ${theme.color[color]}`;
}

/**
 * Drop shadow that only displays when an element is active
 *
 * @param active - whether the element is active
 * @param theme - the theme to use
 * @returns css for rendering a dropshadow when active
 */
export function getActiveShadow({ active, theme }: { active: boolean; theme: DefaultTheme }) {
    return active ? `inset 3px 0 0 ${theme.color.primary}` : "none";
}

/**
 * The default border that should be used for most elements
 *
 * @param theme - the theme to use
 * @returns css for rendering the default border
 */
export function getBorder({ theme }) {
    return `1px solid ${theme.color.greyLight}`;
}

export type getColorProps = {
    color?: string;
    theme: DefaultTheme;
};

/**
 * Get a named color from the theme
 *
 * @param color - the name of the color to get
 * @param theme - the theme to use
 * @returns the color from the theme, or "inherit" if not found
 */
export function getColor({ color, theme }: getColorProps) {
    return get(theme, ["color", color], "inherit");
}

/**
 * Get a named font size from the theme
 *
 * @param size - the name of the font size to get
 * @returns a callable for getting the named size from the current theme
 */
export function getFontSize(size) {
    return ({ theme }) => theme.fontSize[size];
}

/**
 * Get a named font weight from the theme
 *
 * @param weight - the name of the font weight to get
 * @returns a callable for getting the named size from the current theme
 */
export function getFontWeight(weight) {
    return ({ theme }) => theme.fontWeight[weight];
}

export const border = getBorder;

export const borderRadius = {
    sm: ({ theme }) => theme.borderRadius.sm,
    md: ({ theme }) => theme.borderRadius.md,
    lg: ({ theme }) => theme.borderRadius.lg,
};

export const boxShadow = {
    xs: ({ theme }) => theme.boxShadow.xs,
    sm: ({ theme }) => theme.boxShadow.sm,
    md: ({ theme }) => theme.boxShadow.md,
    lg: ({ theme }) => theme.boxShadow.lg,
    input: ({ theme }) => theme.boxShadow.input,
    inset: ({ theme }) => theme.boxShadow.inset,
};

export const fontWeight = {
    normal: ({ theme }) => theme.fontWeight.normal,
    thick: ({ theme }) => theme.fontWeight.thick,
    bold: ({ theme }) => theme.fontWeight.bold,
};
