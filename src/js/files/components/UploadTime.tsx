import { formatDuration, intervalToDuration } from "date-fns";
import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";

const StyledUploadInformation = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("normal")};
    margin-top: 5px;
`;

function isDurationZero(duration: Duration): boolean {
    return Object.values(duration).every(value => value === 0 || value === undefined);
}

/**
 * Displays remaining time and upload speed.
 * @prop remaining - remaining time in seconds
 * @prop uploadSpeed - upload speed in bytes per second
 */
export function UploadTime({ remaining, uploadSpeed }: { remaining: number; uploadSpeed: number }): JSX.Element {
    const timeRemainingInterval: Duration = intervalToDuration({ start: 0, end: remaining * 1000 });
    let formattedTimeRemaining: string = "";

    if (isDurationZero(timeRemainingInterval)) {
        formattedTimeRemaining = "0 seconds remaining";
    } else if (timeRemainingInterval.hours >= 12) {
        formattedTimeRemaining = "> 12hr remaining";
    } else {
        formattedTimeRemaining = formatDuration(timeRemainingInterval) + " remaining";
    }

    const estimatedUploadSpeed: string = (uploadSpeed / 1000000).toFixed(0);

    return (
        <StyledUploadInformation>
            <div>{formattedTimeRemaining}</div>
            <div>{`${estimatedUploadSpeed} MB/s`}</div>
        </StyledUploadInformation>
    );
}
