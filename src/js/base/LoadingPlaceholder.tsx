import React from "react";
import styled from "styled-components/macro";
import { Loader } from "./Loader";

type StyledLoadingPlaceholderProps = {
    margin?: string;
};

const StyledLoadingPlaceholder = styled.div<StyledLoadingPlaceholderProps>`
    margin-top: ${props => props.margin || "220px"};
    text-align: center;
`;

type LoadingPlaceholderProps = {
    margin?: string;
    message?: string;
};

/**
 * A component that renders a centered spinner. Used as a placeholder when the rendering of a component depends on an
 * async action such as an API call. An example would be navigating to a sample detail view and showing a spinner while
 * the sample data is retrieved from the server.
 *
 * @param color {string} the hex color of the spinner
 * @param margin {number} the margin to set above the spinner
 * @param message {message} an optional message to show above the spinner
 */
export function LoadingPlaceholder({ margin = "220px", message = "" }: LoadingPlaceholderProps) {
    return (
        <StyledLoadingPlaceholder margin={margin}>
            {message ? <p>{message}</p> : null}
            <Loader />
        </StyledLoadingPlaceholder>
    );
}
