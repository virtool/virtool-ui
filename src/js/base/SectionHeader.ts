import { getFontSize, getFontWeight } from "@app/theme";
import styled from "styled-components";

const SectionHeader = styled.header`
    margin-bottom: 1.2rem;

    h2 {
        margin-bottom: 0.4rem;
        font-size: ${getFontSize("xl")};
    }

    p {
        color: ${(props) => props.theme.color.greyDarkest};
        font-size: ${getFontSize("lg")};
        font-weight: ${getFontWeight("thick")};
    }
`;

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
