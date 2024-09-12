import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useCreateOTU } from "../queries";
import { OTUForm } from "./OTUForm";

type CreateOTUProps = {
    refId: string;
};

/**
 * Displays a dialog to create an OTU
 */
export default function CreateOTU({ refId }: CreateOTUProps) {
    const history = useHistory();
    const location = useLocation<{ createOTU: boolean }>();

    const mutation = useCreateOTU(refId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    history.replace({ state: { createOTU: false } });
                },
            },
        );
    }

    function onHide() {
        history.replace({ state: { createOTU: false } });
        mutation.reset();
    }

    return (
        <Dialog open={location.state?.createOTU} onOpenChange={onHide}>
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
