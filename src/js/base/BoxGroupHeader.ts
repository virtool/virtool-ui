import { getFontSize, getFontWeight } from "@app/theme";
import styled, { DefaultTheme } from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";

type BoxGroupHeaderProps = {
    theme: DefaultTheme;
};

export const BoxGroupHeader = styled(BoxGroupSection)<BoxGroupHeaderProps>`
    align-items: stretch;
    background-color: ${props => props.theme.color.greyLightest};
    display: flex;
    flex-direction: column;
    font-size: ${getFontSize("md")};
    padding: 15px 15px 12px;

    h2 {
        align-items: center;
        display: flex;
        font-size: ${props => props.theme.fontSize.lg};
        font-weight: ${getFontWeight("thick")};
        margin: 0;
    }

    p {
        color: ${props => props.theme.color.greyDarkest};
        margin: 5px 0 0;
    }
`;

BoxGroupHeader.displayName = "BoxGroupHeader";
