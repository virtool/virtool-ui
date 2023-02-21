import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        borderRadius: {
            sm: string;
            md: string;
            lg: string;
        };
        boxShadow: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            input: string;
            inset: string;
        };
        color: {
            black: string;
            blue: string;
            blueDark: string;
            blueDarkest: string;
            blueLight: string;
            blueLightest: string;
            green: string;
            greenDark: string;
            greenDarkest: string;
            greenLight: string;
            greenLightest: string;
            grey: string;
            greyDark: string;
            greyDarkest: string;
            greyLight: string;
            greyLightest: string;
            greyHover: string;
            orange: string;
            orangeLight: string;
            orangeLightest: string;
            orangeDark: string;
            orangeDarkest: string;
            primary: string;
            primaryDark: string;
            primaryDarkest: string;
            primaryLight: string;
            primaryLightest: string;
            purple: string;
            purpleDark: string;
            purpleDarkest: string;
            purpleLight: string;
            purpleLightest: string;
            red: string;
            redDark: string;
            redDarkest: string;
            redLight: string;
            redLightest: string;
            white: string;
            yellow: string;
            yellowLight: string;
            yellowLightest: string;
            yellowDark: string;
            yellowDarkest: string;
        };
        fontFamily: {
            monospace: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            xxl: string;
        };
        fontWeight: {
            normal: number;
            thick: number;
            bold: number;
        };
        gap: {
            column: string;
            text: string;
        };
        ring: {
            sm: string;
            md: string;
        };
    }
}
