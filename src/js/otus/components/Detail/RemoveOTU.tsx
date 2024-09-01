import { RemoveDialog } from "@base/RemoveDialog";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
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
    const navigate = useNavigate();
    const location = useLocation();
    const mutation = useRemoveOTU();

    function handleConfirm() {
        mutation.mutate(
            { otuId: id },
            {
                onSuccess: () => {
                    navigate(`/refs/${refId}/otus/`);
                    navigate(".", { replace: true, state: { removeOTU: false } });
                },
            }
        );
    }

    return (
        <RemoveDialog
            name={name}
            noun="OTU"
            onConfirm={handleConfirm}
            onHide={() => navigate(".", { replace: true, state: { removeOTU: false } })}
            show={location.state?.removeOTU}
        />
    );
}
