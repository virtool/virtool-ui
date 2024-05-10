import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, theme } from "../../app/theme";
import { Attribution, AttributionWithName } from "../../base";

/**
 * Styled component for the attribution when none found.
 */
const StyledNoneFoundAttribution = styled.div`
    color: ${getColor({ color: "grey", theme })};
    font-size: ${getFontSize("sm")};
    font-style: italic;
    min-height: 20px;
    top: 50%;
`;

/**
 * Props interface for the SubtractionAttribution component.
 * @prop {string} handle - The user handle.
 * @prop {string} time - The time of the subtraction.
 */
interface SubtractionAttributionProps {
    handle: string;
    time?: string;
}

/**
 * Component for rendering attribution with user and time.
 * If only user is provided, renders without time.
 * If neither user nor time is provided, renders default message.
 * @param {SubtractionAttributionProps} props - The component props.
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
