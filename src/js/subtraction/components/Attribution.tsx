import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, theme } from "../../app/theme";
import { Attribution, AttributionWithName } from "../../base";

/**
 * Styled component for the attribution when none found.
 * @prop color - The color of the text.
 * @prop theme - The theme object.
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
 * Subtraction attribution with user handle and time.
 * If only user is provided, renders without time.
 * If neither user nor time is provided, renders default message.
 */
export function SubtractionAttribution({ handle, time }: SubtractionAttributionProps): JSX.Element {
    if (handle) {
        if (time) {
            return <Attribution user={handle} time={time} />;
        }
        return <AttributionWithName user={handle} />;
    }
    return <StyledNoneFoundAttribution> Creator and timestamp unavailable</StyledNoneFoundAttribution>;
}
