import React from "react";
import styled from "styled-components";
import { getColor, getFontWeight } from "../../app/theme";
import { useFetchMessage } from "../querys";

export const StyledMessageBanner = styled.div`
    background-color: ${getColor};
    color: ${props => props.theme.color.white};
    font-weight: ${getFontWeight("thick")};\
    padding: 5px 15px;
`;

/**
 * Displays the banner containing the instance message
 */
export default function MessageBanner() {
    const { data, isLoading } = useFetchMessage();

    return !isLoading && data.message ? (
        <StyledMessageBanner color={data.color}>{data.message}</StyledMessageBanner>
    ) : null;
}
