import { useUrlSearchParam } from "@/hooks";
import RemoveDialog from "@base/RemoveDialog";
import { useUpdateOTU } from "@otus/queries";
import { OTUSegment } from "@otus/types";
import { reject } from "lodash-es";
import React from "react";

type RemoveSegmentProps = {
    abbreviation: string;
    name: string;
    otuId: string;
    /** List of segments associated with the OTU */
    schema: OTUSegment[];
};

/**
 * Displays a dialog for removing a segment
 */
export default function RemoveSegment({
    abbreviation,
    name,
    otuId,
    schema,
}: RemoveSegmentProps) {
    const { value: removeSegmentName, unsetValue: unsetRemoveSegmentName } =
        useUrlSearchParam<string>("removeSegmentName");
    const mutation = useUpdateOTU(otuId);

    function handleSubmit() {
        mutation.mutate(
            {
                otuId,
                name,
                abbreviation,
                schema: reject(schema, { name: removeSegmentName }),
            },
            {
                onSuccess: () => {
                    unsetRemoveSegmentName();
                },
            },
        );
    }

    function onHide() {
        unsetRemoveSegmentName();
    }

    return (
        <RemoveDialog
            name={removeSegmentName}
            noun="Segment"
            onConfirm={handleSubmit}
            onHide={onHide}
            show={Boolean(removeSegmentName)}
        />
    );
}
