import styled from "styled-components";
import { getFontWeight } from "../app/theme";

export const SubviewHeaderAttribution = styled.span`
    color: ${props => props.theme.color.greyDarkest};
    font-size: ${props => props.theme.fontSize.md};
    font-weight: ${getFontWeight("thick")};
`;

SubviewHeaderAttribution.displayName = "SubviewHeaderAttribution";
