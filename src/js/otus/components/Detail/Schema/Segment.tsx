import { BoxGroupSection, IconLink, Label } from "@/base";
import { getFontSize, getFontWeight } from "@app/theme";
import { OTUSegment } from "@otus/types";
import React from "react";
import styled from "styled-components";

const StyledSegment = styled(BoxGroupSection)`
    display: grid;
    align-items: center;
    grid-template-columns: 45fr 1fr 10fr;
    padding: 16px;
    line-height: 1;
`;

const SegmentIcon = styled(IconLink)`
    margin: 6px;
    font-weight: ${getFontWeight("thick")};
    font-size: ${getFontSize("lg")};
`;

type SegmentProps = {
    /** Whether the user has permission to modify the otu */
    canModify: boolean;
    segment: OTUSegment;
};

/**
 * A condensed segment item for use in a list of segments
 */
export default function Segment({ canModify, segment }: SegmentProps) {
    return (
        <StyledSegment>
            <strong>{segment.name}</strong>

            {segment.required ? <Label color="purple">Required</Label> : <Label>Optional</Label>}
            {canModify && (
                <div>
                    <SegmentIcon
                        name="trash"
                        color="red"
                        tip="Remove Segment"
                        to={{ state: { removeSegment: segment.name } }}
                    />
                    <SegmentIcon
                        name="pencil-alt"
                        color="orange"
                        tip="Edit Segment"
                        to={{ state: { editSegment: segment.name } }}
                    />
                </div>
            )}
        </StyledSegment>
    );
}
