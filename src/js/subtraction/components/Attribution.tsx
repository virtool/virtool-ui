import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, theme } from "../../app/theme";
import { Attribution, AttributionWithName } from "@base/index";

/**
 * Default attribution used when creation details are unknown
 */
const StyledNoneFoundAttribution = styled.div`
    color: ${getColor({ color: "grey", theme })};
    font-size: ${getFontSize("sm")};
    font-style: italic;
    min-height: 20px;
    top: 50%;
`;

type SubtractionAttributionProps = {
    /* The user handle */
    handle: string;
    /* The time of the subtraction */
    time?: string;
};

/**
 * Formatted attribution showing creating user's handle and time of creation
 */
export function SubtractionAttribution({
    handle,
    time,
}: SubtractionAttributionProps): JSX.Element {
    if (handle) {
        if (time) {
            return <Attribution user={handle} time={time} />;
        }
        return <AttributionWithName user={handle} />;
    }
    return (
        <StyledNoneFoundAttribution>
            {" "}
            Creator and timestamp unavailable
        </StyledNoneFoundAttribution>
    );
}
