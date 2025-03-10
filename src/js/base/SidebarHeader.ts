import { fontWeight, getFontSize } from "@app/theme";
import styled, { DefaultTheme } from "styled-components";
import SidebarHeaderButton from "./SidebarHeaderButton";

type SidebarHeaderProps = {
    theme: DefaultTheme;
};

const SidebarHeader = styled.h3<SidebarHeaderProps>`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${fontWeight.thick};
    margin: 5px 0 10px;
    height: 32px;

    ${SidebarHeaderButton}, a {
        margin-left: auto;
    }

    a {
        font-size: ${getFontSize("md")};
    }
`;

SidebarHeader.displayName = "SidebarHeader";

export default SidebarHeader;
