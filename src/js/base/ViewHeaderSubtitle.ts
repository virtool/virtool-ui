import styled from "styled-components";
import { getFontSize, getFontWeight } from "../app/theme";

export const ViewHeaderSubtitle = styled.p`
    color: ${props => props.theme.color.greyDarkest};
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    margin-top: 5px;
`;
