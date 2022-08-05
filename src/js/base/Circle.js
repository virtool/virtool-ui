import styled from "styled-components";
import { getColor } from "../app/theme";

export const Circle = styled.div`
    width: 10px;
    height: 10px;
    background-color: ${getColor};
    margin: 0;
    border-radius: 5px;
`;
