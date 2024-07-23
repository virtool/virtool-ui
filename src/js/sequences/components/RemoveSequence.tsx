import { RemoveDialog } from "@base/RemoveDialog";
import { useRemoveSequence } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { useLocationState } from "@utils/hooks";
import { merge } from "lodash";
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
export default function RemoveSequence({ isolateName, isolateId, otuId, sequences }: RemoveSequenceProps) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useRemoveSequence(otuId);

    const sequenceId = locationState?.removeSequence;
    const sequence = find(sequences, { id: sequenceId });

    function handleConfirm() {
        mutation.mutate(
            { otuId, isolateId, sequenceId },
            {
                onSuccess: () => {
                    setLocationState(merge(locationState, { removeSequence: false }));
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
            name={`${sequenceId}`}
            noun="Sequence"
            onConfirm={handleConfirm}
            onHide={() => setLocationState(merge(locationState, { removeSequence: false }))}
            show={Boolean(locationState?.removeSequence)}
            message={removeMessage}
        />
    );
}
