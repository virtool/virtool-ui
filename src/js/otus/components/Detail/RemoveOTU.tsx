import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import { useLocation } from "wouter";
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
    const [, navigate] = useLocation();
    const [openRemoveOTU, setOpenRemoveOTU] = useUrlSearchParams("openRemoveOTU");
    const mutation = useRemoveOTU();

    function handleConfirm() {
        mutation.mutate(
            { otuId: id },
            {
                onSuccess: () => {
                    navigate(`/refs/${refId}/otus/`);
                },
            },
        );
    }

    return (
        <RemoveDialog
            name={name}
            noun="OTU"
            onConfirm={handleConfirm}
            onHide={() => setOpenRemoveOTU("")}
            show={Boolean(openRemoveOTU)}
        />
    );
}
