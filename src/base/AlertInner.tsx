import styled, { DefaultTheme } from "styled-components";

type AlertInnerProps = {
    block?: boolean;
    color?: string;
    level?: boolean;
    theme?: DefaultTheme;
};

const AlertInner = styled.div<AlertInnerProps>`
    align-items: ${(props) => (props.level ? "center" : "normal")};
    display: ${(props) => (props.block ? "block" : "flex")};
    padding: 15px;
`;

AlertInner.displayName = "AlertInner";

export default AlertInner;
