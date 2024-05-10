import { every, map, reject, reverse, sumBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Badge, BoxGroup, BoxGroupHeader, BoxGroupSection } from "../../base";
import { UploadItem } from "./UploadItem";
import { UploadTime } from "./UploadTime";

/**
 * @prop show - whether the overlay should be displayed
 */
const StyledUploadOverlay = styled.div<{ show: boolean }>`
    bottom: 0;
    display: ${props => (props.show ? "block" : "none")};
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

type UploadProps = {
    fileType: string;
    /* Unique identifier for the upload */
    localId: string;
    name: string;
    /* Progress of the upload in percentage */
    progress: number;
    /* Size of the file in bytes */
    size: number;
    /* Remaining time in seconds */
    remaining: number;
    /* Upload speed in bytes per second */
    uploadSpeed: number;
};

/**
 * Overlay uploads with their progress and speeds.
 */
export function UploadOverlay({ uploads }: { uploads: UploadProps[] }): JSX.Element | null {
    if (!uploads.length) {
        return null;
    }

    const totalRemainingUploadTime: number = sumBy(uploads, "remaining");
    const overallUploadSpeed: number = sumBy(uploads, "uploadSpeed");
    const uploadComponents = map(uploads, upload => <UploadItem key={upload.localId} {...upload} />);
    const allUploadsComplete: boolean = every(uploads, ["progress", 100]);

    return (
        <StyledUploadOverlay show={uploads.length > 0}>
            <UploadOverlayContent>
                <BoxGroupHeader>
                    Uploads <Badge>{uploadComponents.length}</Badge>
                    {allUploadsComplete ? (
                        <StyledUploadInformation>Finishing uploads</StyledUploadInformation>
                    ) : (
                        <UploadTime remaining={totalRemainingUploadTime} uploadSpeed={overallUploadSpeed} />
                    )}
                </BoxGroupHeader>
                <UploadOverlayList>{uploadComponents}</UploadOverlayList>
            </UploadOverlayContent>
        </StyledUploadOverlay>
    );
}

export function mapStateToProps(state) {
    return {
        uploads: reverse(reject(state.files.uploads, { type: "reference" })),
    };
}

export default connect(mapStateToProps)(UploadOverlay);
