import { formatDuration, intervalToDuration } from "date-fns";
import { every, map, reject, reverse, sumBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Badge, BoxGroup, BoxGroupHeader, BoxGroupSection } from "../../base";
import { UploadItem } from "./UploadItem";

const StyledUploadOverlay = styled.div`
    bottom: 0;
    ${props => (props.show ? "" : "display: none;")};
    max-width: 500px;
    padding: 0 15px 15px 0;
    position: fixed;
    right: 0;
    width: 35%;
    z-index: 90;
`;

const UploadOverlayContent = styled(BoxGroup)`
    background-color: ${props => props.theme.color.white};
    box-shadow: ${props => props.theme.boxShadow.lg};
    margin: 0;

    ${BoxGroupHeader} {
        align-items: auto;
        display: block;
        font-weight: ${getFontWeight("thick")};
        font-size: ${getFontSize("lg")};
    }
`;

const UploadOverlayList = styled(BoxGroupSection)`
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
    padding: 0;
`;

const StyledUploadInformation = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("normal")};
    margin-top: 5px;
`;

const getFormat = timeInterval => {
    if (timeInterval.hours) {
        return "hours";
    } else if (timeInterval.minutes) {
        return "minutes";
    } else if (timeInterval.seconds) {
        return "seconds";
    }
    return "";
};

const UploadTiming = ({ remaining, uploadSpeed }) => {
    const remainingTime = remaining ? remaining : 3600;
    const estimatedUploadSpeed = uploadSpeed ? (uploadSpeed / 1000000).toFixed(0) : 0;
    const timeRemainingInterval = intervalToDuration({ start: 0, end: remainingTime * 1000 });

    let formattedTimeRemaining = "";
    if (timeRemainingInterval.hours > 12) {
        formattedTimeRemaining = " > 12hr remaining";
    } else {
        formattedTimeRemaining = formatDuration(
            {
                hours: timeRemainingInterval.hours,
                minutes: timeRemainingInterval.minutes,
                seconds: timeRemainingInterval.seconds,
            },

            {
                format: [getFormat(timeRemainingInterval)],
            },
        );
        formattedTimeRemaining = formattedTimeRemaining.length
            ? `${formattedTimeRemaining} remaining`
            : "0 seconds remaining";
    }

    return (
        <StyledUploadInformation>
            <div>{formattedTimeRemaining}</div>
            <div>{`${estimatedUploadSpeed} MB/s`}</div>
        </StyledUploadInformation>
    );
};

export const UploadOverlay = ({ uploads }) => {
    if (uploads.length) {
        const totalRemainingUploadTime = sumBy(uploads, "remaining");
        const overallUploadSpeed = sumBy(uploads, "uploadSpeed");
        const uploadComponents = map(uploads, upload => <UploadItem key={upload.localId} {...upload} />);

        const allUploadsComplete = every(uploads, ["progress", 100]);

        return (
            <StyledUploadOverlay show={uploads.length}>
                <UploadOverlayContent>
                    <BoxGroupHeader>
                        Uploads <Badge>{uploadComponents.length}</Badge>
                        {allUploadsComplete ? (
                            <StyledUploadInformation>Finishing uploads</StyledUploadInformation>
                        ) : (
                            <UploadTiming remaining={totalRemainingUploadTime} uploadSpeed={overallUploadSpeed} />
                        )}
                    </BoxGroupHeader>
                    <UploadOverlayList>{uploadComponents}</UploadOverlayList>
                </UploadOverlayContent>
            </StyledUploadOverlay>
        );
    }

    return null;
};

export const mapStateToProps = state => {
    return { uploads: reverse(reject(state.files.uploads, { type: "reference" })) };
};

export default connect(mapStateToProps)(UploadOverlay);
