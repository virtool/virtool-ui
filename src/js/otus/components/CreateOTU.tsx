import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import { useCreateOTU } from "../queries";
import { OTUForm } from "./OTUForm";

type CreateOTUProps = {
    refId: string;
};

/**
 * Displays a dialog to create an OTU
 */
export default function CreateOTU({ refId }: CreateOTUProps) {
    const [openCreateOtu, setOpenCreateOtu] = useUrlSearchParams("openCreateOTU");

    const mutation = useCreateOTU(refId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    setOpenCreateOtu("");
                },
            }
        );
    }

    function onHide() {
        setOpenCreateOtu("");
        mutation.reset();
    }

    return (
        <Dialog open={Boolean(openCreateOtu)} onOpenChange={onHide}>
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
