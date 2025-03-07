import { getColor } from "@app/theme";
import styled, { DefaultTheme } from "styled-components";

type CircleProps = {
    color: string;
    theme: DefaultTheme;
};

const Dot = styled.div<CircleProps>`
    width: 10px;
    height: 10px;
    background-color: ${getColor};
    margin: 0;
    border-radius: 5px;
`;

Dot.displayName = "Dot";

export default Dot;
