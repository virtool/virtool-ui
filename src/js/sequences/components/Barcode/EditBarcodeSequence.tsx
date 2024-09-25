import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useEditSequence } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { ReferenceTarget } from "@references/types";
import BarcodeSequenceForm from "@sequences/components/Barcode/BarcodeSequenceForm";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";

type EditBarcodeSequence = {
    activeSequence: OTUSequence;
    isolateId: string;
    otuId: string;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * Displays dialog to edit a barcode sequence
 */
export default function EditBarcodeSequence({ activeSequence, isolateId, otuId, targets }: EditBarcodeSequence) {
    const [openEditSequence, setOpenEditSequence] = useUrlSearchParams("openEditSequence");
    const mutation = useEditSequence(otuId);

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
