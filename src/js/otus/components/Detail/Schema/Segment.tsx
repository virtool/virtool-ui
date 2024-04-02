import { BoxGroupSection, Icon, IconLink, Label } from "@/base";
import { getFontSize, getFontWeight } from "@app/theme";
import { OTUSegment } from "@otus/types";
import React from "react";
import styled from "styled-components";

const StyledSegment = styled(BoxGroupSection)`
    display: grid;
    align-items: center;
    grid-template-columns: 45fr 1fr 10fr 10fr;
    padding: 16px;
    line-height: 1;
`;

const SegmentIcon = styled(IconLink)`
    margin: 6px;
    font-weight: ${getFontWeight("thick")};
    font-size: ${getFontSize("lg")};
`;

const DragIcons = styled.div`
    display: flex;
    justify-content: center;
    margin-left: auto;
`;

type SegmentProps = {
    /** Whether the user has permission to modify the otu */
    canModify: boolean;
    /** Whether the segment is the first in the list */
    first: boolean;
    /** Whether the segment is the last in the list */
    last: boolean;
    /** A callback function to move the segment up */
    onMoveUp: () => void;
    /** A callback function to move the segment down */
    onMoveDown: () => void;
    segment: OTUSegment;
};

/**
 * A condensed segment item for use in a list of segments
 */
export default function Segment({ canModify, first, last, onMoveUp, onMoveDown, segment }: SegmentProps) {
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

            <DragIcons>
                {!first && <Icon name="caret-up" aria-label="move segment up" onClick={onMoveUp} />}
                {!last && <Icon name="caret-down" aria-label="move segment down" onClick={onMoveDown} />}
            </DragIcons>
        </StyledSegment>
    );
}
