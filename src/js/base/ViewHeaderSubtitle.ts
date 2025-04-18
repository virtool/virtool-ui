import { getFontSize, getFontWeight } from "@app/theme";
import styled from "styled-components";

const ViewHeaderSubtitle = styled.p`
    color: ${(props) => props.theme.color.greyDarkest};
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    margin-top: 5px;
`;

ViewHeaderSubtitle.displayName = "ViewHeaderSubtitle";

export default ViewHeaderSubtitle;
