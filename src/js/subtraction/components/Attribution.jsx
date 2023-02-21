import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, theme } from "../../app/theme";
import { Attribution, AttributionWithName } from "../../base";

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
        return <AttributionWithName user={handle} />;
    }
    return <StyledNoneFoundAttribution> Creator and timestamp unavailable</StyledNoneFoundAttribution>;
}
