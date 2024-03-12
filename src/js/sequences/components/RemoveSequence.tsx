import { RemoveDialog } from "@base/RemoveDialog";
import { useRemoveSequence } from "@otus/queries";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

type RemoveSequenceProps = {
    isolateName: string;
    isolateId: string;
    otuId: string;
};

/**
 * Displays a dialog for removing a sequence
 */
export default function RemoveSequence({ isolateName, isolateId, otuId }: RemoveSequenceProps) {
    const history = useHistory();
    const location = useLocation<{ removeSequence: string }>();
    const mutation = useRemoveSequence();

    const sequenceId = location.state?.removeSequence;

    function handleConfirm() {
        mutation.mutate({ otuId, isolateId, sequenceId: sequenceId });
        history.replace({ state: { removeSequence: false } });
    }

    const removeMessage = (
        <span>
            Are you sure you want to remove the sequence from
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
