import { getFontWeight } from "../app/theme";
import styled from "styled-components";

const SubviewHeaderAttribution = styled.span`
    color: ${(props) => props.theme.color.greyDarkest};
    font-size: ${(props) => props.theme.fontSize.md};
    font-weight: ${getFontWeight("thick")};
`;

SubviewHeaderAttribution.displayName = "SubviewHeaderAttribution";

export default SubviewHeaderAttribution;
