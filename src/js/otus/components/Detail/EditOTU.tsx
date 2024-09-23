import { useUpdateOTU } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../base";
import { OTUForm } from "../OTUForm";

type EditOTUProps = {
    abbreviation: string;
    name: string;
    otuId: string;
};

/**
 * Displays a dialog for editing an OTU
 */
export default function EditOTU({ abbreviation, name, otuId }: EditOTUProps) {
    const [openEditOTU, setOpenEditOTU] = useUrlSearchParams("openEditOTU");

    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { otuId, name, abbreviation },
            {
                onSuccess: () => {
                    setOpenEditOTU("");
                },
            }
        );
    }

    function onHide() {
        setOpenEditOTU("");
        mutation.reset();
    }

    return (
        <Dialog open={Boolean(openEditOTU)} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit OTU</DialogTitle>
                    <OTUForm
                        name={name}
                        abbreviation={abbreviation}
                        error={mutation.isError && mutation.error.response.body.message}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
