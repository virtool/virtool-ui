import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { OTUQueryKeys, useCreateOTU } from "../querys";
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
    const queryClient = useQueryClient();

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    history.replace({ state: { createOTU: false } });
                    queryClient.invalidateQueries(OTUQueryKeys.lists());
                },
            },
        );
    }

    return (
        <Dialog open={location.state?.createOTU} onOpenChange={() => history.replace({ state: { createOTU: false } })}>
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
