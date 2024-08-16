import { BoxGroupSection, Label } from "@/base";
import { IconButton } from "@base/IconButton";
import { OTUSegment } from "@otus/types";
import { cn } from "@utils/utils";
import React from "react";
import { useHistory } from "react-router-dom";

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
    const history = useHistory();

    return (
        <BoxGroupSection
            className={cn(
                "grid",
                "grid-cols-[45fr_1fr_10fr_10fr]",
                "items-center",
                "leading-0",
                "py-0",
                "px-4",
                "h-12"
            )}
        >
            <strong>{segment.name}</strong>

            {segment.required ? <Label color="purple">Required</Label> : <Label>Optional</Label>}
            {canModify && (
                <div className={cn("text-lg", "m-2")}>
                    <IconButton
                        name="trash"
                        color="red"
                        tip="remove segment"
                        onClick={() => history.push({ state: { removeSegment: segment.name } })}
                    />
                    <IconButton
                        name="pen"
                        color="grayDark"
                        tip="edit segment"
                        onClick={() => history.push({ state: { editSegment: segment.name } })}
                    />
                </div>
            )}

            <div className={cn("flex", "justify-center", "ml-auto", "font-bold", "text-2xl")}>
                <IconButton
                    className={cn("leading-none", { hidden: first, flex: !first })}
                    name="caret-up"
                    tip="move up"
                    onClick={onMoveUp}
                />
                <IconButton
                    className={cn("leading-none", { hidden: last, flex: !last })}
                    name="caret-down"
                    tip="move down"
                    onClick={onMoveDown}
                />
            </div>
        </BoxGroupSection>
    );
}
