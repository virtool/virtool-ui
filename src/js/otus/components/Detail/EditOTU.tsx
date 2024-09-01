import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useUpdateOTU } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
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
    const location = useLocation();
    const navigate = useNavigate();
    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { otuId, name, abbreviation },
            {
                onSuccess: () => {
                    navigate(".", { replace: true, state: { editOTU: false } });
                },
            }
        );
    }

    function onHide() {
        navigate(".", { replace: true, state: { editOTU: false } });
        mutation.reset();
    }

    return (
        <Dialog open={location.state?.editOTU} onOpenChange={onHide}>
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
