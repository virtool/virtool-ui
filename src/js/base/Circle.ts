import styled, { DefaultTheme } from "styled-components/macro";
import { getColor } from "../app/theme";

type CircleProps = {
    color: string;
    theme: DefaultTheme;
};

export const Circle = styled.div<CircleProps>`
    width: 10px;
    height: 10px;
    background-color: ${getColor};
    margin: 0;
    border-radius: 5px;
`;
