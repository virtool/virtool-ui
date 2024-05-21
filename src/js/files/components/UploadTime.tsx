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
    return every(duration, (value) => value === 0 || value === undefined);
}

type UploadTimeProps = {
    /* Remaining time in seconds */
    remaining: number;
    /* Upload speed in bytes per second */
    uploadSpeed: number;
};

/**
 * Displays remaining time and upload speed.
 */
export function UploadTime({ remaining, uploadSpeed }: UploadTimeProps): JSX.Element {
    const timeRemainingInterval: Duration = intervalToDuration({ start: 0, end: remaining * 1000 });
    let formattedTimeRemaining = "";

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
