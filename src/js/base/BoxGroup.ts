import { ReactNode } from "react";
import styled, { DefaultTheme } from "styled-components";
import Box from "./Box";

type BoxGroupProps = {
    children: ReactNode;
    theme: DefaultTheme;
};

const BoxGroup = styled(Box)<BoxGroupProps>`
    border-radius: ${(props) => props.theme.borderRadius.sm};
    padding: 0;
    position: relative;
`;

export default BoxGroup;

BoxGroup.displayName = "BoxGroup";
