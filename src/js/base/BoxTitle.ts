import styled, { DefaultTheme } from "styled-components";

type BoxTitleProps = {
    theme: DefaultTheme;
};

export const BoxTitle = styled.h1<BoxTitleProps>`
    font-size: ${(props) => props.theme.fontSize.md};
    font-weight: ${(props) => props.theme.fontWeight.thick};
    margin: 5px 0 15px 0;
`;

BoxTitle.displayName = "BoxTitle";

export default BoxTitle;
