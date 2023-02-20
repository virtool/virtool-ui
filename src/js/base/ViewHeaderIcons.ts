import styled, { DefaultTheme } from "styled-components/macro";

type ViewHeaderIconsProps = {
    theme: DefaultTheme;
};

export const ViewHeaderIcons = styled.div<ViewHeaderIconsProps>`
    align-items: center;
    display: flex;
    font-size: ${props => props.theme.fontSize.lg};
    margin-left: auto;

    > *:not(:last-child) {
        margin-right: 5px;
    }
`;
