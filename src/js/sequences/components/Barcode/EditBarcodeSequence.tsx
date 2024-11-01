import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useEditSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import BarcodeSequenceForm from "@sequences/components/Barcode/BarcodeSequenceForm";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import { useGetActiveSequence, useGetSelectableTargets } from "@sequences/hooks";

type EditBarcodeSequence = {
    isolateId: string;
    otuId: string;
};

/**
 * Displays dialog to edit a barcode sequence
 */
export default function EditBarcodeSequence({ isolateId, otuId }: EditBarcodeSequence) {
    const [openEditSequence, setOpenEditSequence] = useUrlSearchParam("openEditSequence");
    const mutation = useEditSequence(otuId);

    const targets = useGetSelectableTargets();
    const activeSequence = useGetActiveSequence();

    function onSubmit({ accession, definition, host, sequence, target }) {
        mutation.mutate(
            { isolateId, sequenceId: activeSequence.id, accession, definition, host, sequence, target },
            {
                onSuccess: () => {
                    setOpenEditSequence("");
                },
            },
        );
    }

    return (
        <Dialog open={Boolean(openEditSequence)} onOpenChange={() => setOpenEditSequence("")}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="top-1/2">
                    <DialogTitle>Edit Sequence</DialogTitle>
                    <BarcodeSequenceForm
                        activeSequence={activeSequence}
                        noun="edit"
                        onSubmit={onSubmit}
                        otuId={otuId}
                        targets={targets}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
