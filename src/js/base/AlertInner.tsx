import styled, { DefaultTheme } from "styled-components";
import { getColor } from "../app/theme";

type AlertInnerProps = {
    block?: boolean;
    color?: string;
    level?: boolean;
    theme?: DefaultTheme;
};

export const AlertInner = styled.div<AlertInnerProps>`
    align-items: ${props => (props.level ? "center" : "normal")};
    border-left: 10px solid ${getColor};
    display: ${props => (props.block ? "block" : "flex")};
    padding: 15px;
`;

AlertInner.displayName = "AlertInner";
