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

/**
 * Determines the format string for time display based on the time interval.
 * @returns "hours" if hours are present, "minutes" if minutes are present,
 *  "seconds" if seconds are present, or an empty string if none are present.
 */
function getFormat(timeInterval: { hours?: number; minutes?: number; seconds?: number }): string {
    if (timeInterval.hours) {
        return "hour";
    } else if (timeInterval.minutes) {
        return "min";
    } else if (timeInterval.seconds) {
        return "seconds";
    }
    return "";
}

/**
 * Displays remaining time and upload speed.
 * @prop remaining - remaining time in seconds
 * @prop uploadSpeed - upload speed in bytes per second
 */
export function UploadTime({ remaining, uploadSpeed }: { remaining: number; uploadSpeed: number }): JSX.Element {
    const timeRemainingInterval: Duration = intervalToDuration({ start: 0, end: remaining * 1000 });
    let formattedTimeRemaining: string = formatDuration(timeRemainingInterval, {
        format: [getFormat(timeRemainingInterval)],
    });

    if (timeRemainingInterval.hours > 12) {
        formattedTimeRemaining = "> 12hr remaining";
    } else {
        formattedTimeRemaining = `${formattedTimeRemaining.length ? formattedTimeRemaining : "0 seconds"} remaining`;
    }

    const estimatedUploadSpeed: string = (uploadSpeed / 1000000).toFixed(0);

    return (
        <StyledUploadInformation>
            <div>{formattedTimeRemaining}</div>
            <div>{`${estimatedUploadSpeed} MB/s`}</div>
        </StyledUploadInformation>
    );
}
