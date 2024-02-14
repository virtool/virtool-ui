import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useQueryClient } from "react-query";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { OTUQueryKeys, useCreateOTU } from "../querys";
import { OTUForm } from "./OTUForm";

type CreateOTUProps = {
    /** A callback function to hide the dialog */
    onHide: () => void;
    refId: string;
    /** Indicates whether the dialog for creating an OTU is visible */
    show: boolean;
};

/**
 * Displays a dialog to create an OTU
 */
export default function CreateOTU({ onHide, refId, show }: CreateOTUProps) {
    const mutation = useCreateOTU(refId);
    const queryClient = useQueryClient();

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    onHide();
                    queryClient.invalidateQueries(OTUQueryKeys.lists());
                },
            },
        );
    }

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create OTU</DialogTitle>
                    <OTUForm onSubmit={handleSubmit} error={mutation.isError && mutation.error.response.body.message} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
