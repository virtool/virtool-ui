import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useDialogParam } from "../../app/hooks";
import { useCreateOTU } from "../queries";
import { OTUForm } from "./OTUForm";

type CreateOTUProps = {
    refId: string;
};

/**
 * Displays a dialog to create an OTU
 */
export default function CreateOTU({ refId }: CreateOTUProps) {
    const { open: openCreateOtu, setOpen: setOpenCreateOtu } =
        useDialogParam("openCreateOTU");

    const mutation = useCreateOTU(refId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    setOpenCreateOtu(false);
                },
            },
        );
    }

    function onHide() {
        setOpenCreateOtu(false);
        mutation.reset();
    }

    return (
        <Dialog open={openCreateOtu} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create OTU</DialogTitle>
                    <OTUForm
                        onSubmit={handleSubmit}
                        error={
                            mutation.isError &&
                            mutation.error.response?.body?.message
                        }
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
