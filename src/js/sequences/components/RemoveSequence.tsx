import { RemoveDialog } from "@base/RemoveDialog";
import { useRemoveSequence } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { find } from "lodash-es";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

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
    const history = useHistory();
    const location = useLocation<{ removeSequence: string }>();
    const mutation = useRemoveSequence();

    const sequenceId = location.state?.removeSequence;
    const sequence = find(sequences, { id: sequenceId });

    function handleConfirm() {
        mutation.mutate({ otuId, isolateId, sequenceId: sequenceId });
        history.replace({ state: { removeSequence: false } });
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
            onHide={() => history.replace({ state: { removeSequence: false } })}
            show={Boolean(location.state?.removeSequence)}
            message={removeMessage}
        />
    );
}
