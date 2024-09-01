import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
import { useCreateOTU } from "../queries";
import { OTUForm } from "./OTUForm";

type CreateOTUProps = {
    refId: string;
};

/**
 * Displays a dialog to create an OTU
 */
export default function CreateOTU({ refId }: CreateOTUProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const mutation = useCreateOTU(refId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    navigate(".", { replace: true, state: { createOTU: false } });
                },
            }
        );
    }

    function onHide() {
        navigate(".", { replace: true, state: { createOTU: false } });
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
