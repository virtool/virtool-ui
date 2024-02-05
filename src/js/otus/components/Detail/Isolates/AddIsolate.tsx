import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useQueryClient } from "react-query";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../../base";
import { OTUQueryKeys, useCreateIsolate } from "../../../querys";
import IsolateForm from "./IsolateForm";

type AddIsolateProps = {
    allowedSourceTypes: string[];
    onHide: () => void;
    otuId: string;
    restrictSourceTypes: boolean;
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
