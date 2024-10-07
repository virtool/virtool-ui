import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useAddSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { ReferenceTarget } from "@references/types";
import BarcodeSequenceForm from "@sequences/components/Barcode/BarcodeSequenceForm";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";

type AddBarcodeSequenceProps = {
    isolateId: string;
    otuId: string;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * Displays dialog to add a barcode sequence
 */
export default function AddBarcodeSequence({ isolateId, otuId, targets }: AddBarcodeSequenceProps) {
    const [openAddSequence, setOpenAddSequence] = useUrlSearchParams("openAddSequence");
    const mutation = useAddSequence(otuId);

    function onSubmit({ accession, definition, host, sequence, target }) {
        mutation.mutate(
            {
                isolateId,
                accession,
                definition,
                host,
                sequence,
                target,
            },
            {
                onSuccess: () => {
                    setOpenAddSequence("");
                },
            },
        );
    }

    return (
        <Dialog open={Boolean(openAddSequence)} onOpenChange={() => setOpenAddSequence("")}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="top-1/2">
                    <DialogTitle>Add Sequence</DialogTitle>
                    <BarcodeSequenceForm noun="add" onSubmit={onSubmit} otuId={otuId} targets={targets} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
