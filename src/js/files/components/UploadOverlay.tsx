import { getFontSize, getFontWeight } from "@app/theme";
import { Badge, BoxGroup, BoxGroupHeader } from "@base";
import { useUploaderStore } from "@files/uploader";
import { cn } from "@utils/utils";
import { formatDuration, intervalToDuration } from "date-fns";
import { map } from "lodash-es";
import numbro from "numbro";
import React from "react";
import styled from "styled-components";
import { UploadItem } from "./UploadItem";

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

const StyledUploadInformation = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("normal")};
    margin-top: 5px;
`;

/**
 * Overlay uploads with their progress and speeds.
 */
export default function UploadOverlay(): JSX.Element | null {
    const uploads = useUploaderStore(state => state.uploads);
    const remaining = useUploaderStore(state => state.remaining);
    const speed = useUploaderStore(state => state.speed);

    if (uploads.length === 0) {
        return null;
    }

    const uploadComponents = map(uploads, upload => <UploadItem key={upload.localId} {...upload} />);

    const formattedRemaining = formatDuration(intervalToDuration({ start: 0, end: remaining * 1000 }));

    const formattedSpeed = numbro(speed).format({
        base: "decimal",
        mantissa: 1,
        output: "byte",
        spaceSeparated: true,
    });

    return (
        <div className={cn("fixed bottom-0 right-0 w-96 pr-4 pb-4 z-50")}>
            <UploadOverlayContent>
                <BoxGroupHeader>
                    Uploads <Badge>{uploadComponents.length}</Badge>
                    {uploads.every(upload => upload.progress === 100) ? (
                        <StyledUploadInformation>Finishing uploads</StyledUploadInformation>
                    ) : (
                        <StyledUploadInformation>
                            {formattedRemaining && <span>{formattedRemaining} remaining</span>}
                            <span>{formattedSpeed}/s</span>
                        </StyledUploadInformation>
                    )}
                </BoxGroupHeader>
                <div className="max-h-96 overflow-y-scroll">{uploadComponents}</div>
            </UploadOverlayContent>
        </div>
    );
}
