import RemoveDialog from "@base/RemoveDialog";
import React, { useCallback } from "react";
import { useRemoveIsolate } from "../../../queries";

type RemoveIsolateProps = {
    /** The id of the isolate being deleted */
    id: string;
    /** The name of the isolate being deleted */
    name: string;
    /** A callback function to hide the dialog */
    onHide: () => void;
    /** The id of the otu in which the isolate belongs to */
    otuId: string;
    /** Whether the dialog to remove the isolate is visible */
    show: boolean;
};

/**
 * Displays a dialog for removing an OTU isolate
 */
export default function RemoveIsolate({
    id,
    name,
    onHide,
    otuId,
    show,
}: RemoveIsolateProps) {
    const mutation = useRemoveIsolate();

    const handleConfirm = useCallback(() => {
        mutation.mutate(
            { otuId, isolateId: id },
            {
                onSuccess: () => {
                    onHide();
                },
            },
        );
    }, [otuId, id]);

    return (
        <RemoveDialog
            name={name}
            noun="Isolate"
            onConfirm={handleConfirm}
            onHide={onHide}
            show={show}
        />
    );
}
