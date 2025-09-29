import { useUrlSearchParam } from "@app/hooks";
import { cn } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import { OtuSegment } from "@otus/types";
import styled from "styled-components";

const StyledSegment = styled(BoxGroupSection)`
    display: grid;
    align-items: center;
    grid-template-columns: 45fr 1fr 10fr 10fr;
    padding: 0 16px;
    line-height: 1;
    height: 51px;
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
    segment: OtuSegment;
};

/**
 * A condensed segment item for use in a list of segments
 */
export default function Segment({
    canModify,
    first,
    last,
    onMoveUp,
    onMoveDown,
    segment,
}: SegmentProps) {
    const { setValue: setRemoveSegmentName } =
        useUrlSearchParam<string>("removeSegmentName");
    const { setValue: setEditSegmentName } =
        useUrlSearchParam<string>("editSegmentName");

    return (
        <StyledSegment>
            <strong>{segment.name}</strong>

            {segment.required ? (
                <Label color="purple">Required</Label>
            ) : (
                <Label>Optional</Label>
            )}
            {canModify && (
                <div className={cn("text-lg", "m-2")}>
                    <IconButton
                        name="trash"
                        color="red"
                        tip="remove segment"
                        onClick={() => setRemoveSegmentName(segment.name)}
                    />
                    <IconButton
                        name="pen"
                        color="grayDark"
                        tip="edit segment"
                        onClick={() => setEditSegmentName(segment.name)}
                    />
                </div>
            )}

            <div
                className={cn(
                    "flex",
                    "justify-center",
                    "ml-auto",
                    "font-bold",
                    "text-2xl",
                )}
            >
                <IconButton
                    className={cn("leading-none", {
                        hidden: first,
                        flex: !first,
                    })}
                    name="caret-up"
                    tip="move up"
                    onClick={onMoveUp}
                />
                <IconButton
                    className={cn("leading-none", {
                        hidden: last,
                        flex: !last,
                    })}
                    name="caret-down"
                    tip="move down"
                    onClick={onMoveDown}
                />
            </div>
        </StyledSegment>
    );
}
