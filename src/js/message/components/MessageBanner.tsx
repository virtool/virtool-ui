import { getColor, getFontWeight } from "@app/theme";
import React from "react";
import styled from "styled-components";
import { useFetchMessage } from "../queries";

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
    const { data, isPending } = useFetchMessage();

    return !isPending && data?.message ? (
        <StyledMessageBanner color={data.color}>{data.message}</StyledMessageBanner>
    ) : null;
}
