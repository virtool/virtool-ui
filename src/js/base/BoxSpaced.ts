import styled, { DefaultTheme } from "styled-components/macro";
import { Box } from "./Box";

type BoxSpacedProps = {
    theme: DefaultTheme;
};

export const BoxSpaced = styled(Box)<BoxSpacedProps>`
    box-shadow: ${props => props.theme.boxShadow.md};
    margin-bottom: 10px;
`;
