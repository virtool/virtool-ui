import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../../base";
import { OTUQueryKeys, useCreateIsolate } from "../../../querys";
import IsolateForm from "./IsolateForm";

type AddIsolateProps = {
    allowedSourceTypes: string[];
    /** A callback function to hide the dialog */
    onHide: () => void;
    otuId: string;
    /** Indicates whether the source types are restricted */
    restrictSourceTypes: boolean;
    /** Indicates whether the dialog to add an OTU is visible */
    show: boolean;
};

/**
 * Displays dialog to add an OTU isolate
 */
export default function AddIsolate({ allowedSourceTypes, onHide, otuId, restrictSourceTypes, show }: AddIsolateProps) {
    const mutation = useCreateIsolate();
    const queryClient = useQueryClient();

    function handleSubmit({ sourceName, sourceType }) {
        mutation.mutate(
            { otuId, sourceType: sourceType || "unknown", sourceName },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                    onHide();
                },
            },
        );
    }

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Add Isolate</DialogTitle>
                    <IsolateForm
                        allowedSourceTypes={allowedSourceTypes}
                        restrictSourceTypes={restrictSourceTypes}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
