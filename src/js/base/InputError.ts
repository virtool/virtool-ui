import styled from "styled-components/macro";
import { getFontWeight } from "../app/theme";

export const InputError = styled.p`
    color: ${props => props.theme.color.red};
    font-size: ${props => props.theme.fontSize.sm};
    font-weight: ${getFontWeight("thick")};
    margin: 5px 0 -10px;
    min-height: 18px;
    text-align: right;
`;
