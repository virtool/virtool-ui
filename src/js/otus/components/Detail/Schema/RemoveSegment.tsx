import { reject } from "lodash-es";
import React from "react";
import { RemoveDialog } from "../../../../base/RemoveDialog";
import { OTUSegment } from "../../../types";

type RemoveSegmentProps = {
    /** Name of the segment being removed */
    activeName: string;
    /** List of segments associated with the OTU */
    schema: OTUSegment[];
    /** Indicates whether to show the dialog for removing a segment */
    show: boolean;
    /** A callback function to hide the dialog */
    onHide: () => void;
    /** A callback function to handle removal of segment */
    onSubmit: (reject: any) => void;
};

/**
 * Displays a dialog for removing a segment
 */
export default function RemoveSegment({ activeName, schema, show, onHide, onSubmit }: RemoveSegmentProps) {
    return (
        <RemoveDialog
            name={activeName}
            noun="Segment"
            onConfirm={() => onSubmit(reject(schema, { name: activeName }))}
            onHide={onHide}
            show={show}
        />
    );
}
