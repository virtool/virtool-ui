import { Attribution, NameAttribution } from "../../base";
import React from "react";
import { theme, getColor, getFontSize } from "../../app/theme";
import styled from "styled-components";
const StyledNoneFoundAttribution = styled.div`
    color: ${getColor({ color: "grey", theme })};
    font-size: ${getFontSize("sm")};
    font-style: italic;
    min-height: 20px;
    top: 50%;
`;

export function SubtractionAttribution({ handle, time }) {
    if (handle) {
        if (time) {
            return <Attribution user={handle} time={time} />;
        }
        return <NameAttribution user={handle} />;
    }
    return <StyledNoneFoundAttribution> Creator and timestamp unavailable</StyledNoneFoundAttribution>;
}
