import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { RemoveDialog } from "../../../base/RemoveDialog";
import { useRemoveOTU } from "../../queries";

type RemoveOTUProps = {
    id: string;
    name: string;
    refId: string;
};

/**
 * Displays a dialog for removing an OTU
 */
export default function RemoveOTU({ id, name, refId }: RemoveOTUProps) {
    const history = useHistory();
    const location = useLocation<{ removeOTU: boolean }>();
    const mutation = useRemoveOTU();

    function handleConfirm() {
        mutation.mutate(
            { otuId: id },
            {
                onSuccess: () => {
                    history.push(`/refs/${refId}/otus/`);
                    history.replace({ state: { removeOTU: false } });
                },
            },
        );
    }

    return (
        <RemoveDialog
            name={name}
            noun="OTU"
            onConfirm={handleConfirm}
            onHide={() => history.replace({ state: { removeOTU: false } })}
            show={location.state?.removeOTU}
        />
    );
}
