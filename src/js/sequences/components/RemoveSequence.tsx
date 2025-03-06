import { RemoveDialog } from "@base/RemoveDialog";
import { useRemoveSequence } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { useUrlSearchParam } from "@/hooks";
import { find } from "lodash-es";
import React from "react";

type RemoveSequenceProps = {
    isolateName: string;
    isolateId: string;
    otuId: string;
    sequences: OTUSequence[];
};

/**
 * Displays a dialog for removing a sequence
 */
export default function RemoveSequence({
    isolateName,
    isolateId,
    otuId,
    sequences,
}: RemoveSequenceProps) {
    const { value: removeSequenceId, unsetValue: unsetRemoveSequence } =
        useUrlSearchParam<string>("removeSequenceId");

    const mutation = useRemoveSequence(otuId);

    const sequence = find(sequences, { id: removeSequenceId });

    function handleConfirm() {
        mutation.mutate(
            { otuId, isolateId, sequenceId: removeSequenceId },
            {
                onSuccess: () => {
                    unsetRemoveSequence();
                },
            },
        );
    }

    const removeMessage = (
        <span>
            Are you sure you want to remove the sequence
            <strong> {sequence?.accession}</strong> from
            <strong> {isolateName}</strong>?
        </span>
    );

    return (
        <RemoveDialog
            name={`${removeSequenceId}`}
            noun="Sequence"
            onConfirm={handleConfirm}
            onHide={() => unsetRemoveSequence()}
            show={Boolean(removeSequenceId)}
            message={removeMessage}
        />
    );
}
