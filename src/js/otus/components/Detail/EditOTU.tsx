import { OTUQueryKeys, useUpdateOTU } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
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
    const location = useLocation<{ editOTU: boolean }>();
    const history = useHistory();
    const mutation = useUpdateOTU();
    const queryClient = useQueryClient();

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { otuId, name, abbreviation },
            {
                onSuccess: () => {
                    history.replace({ state: { editOTU: false } });
                    queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                },
            },
        );
    }

    function onHide() {
        history.replace({ state: { editOTU: false } });
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
