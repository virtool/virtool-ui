import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useEditSequence } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { ReferenceTarget } from "@references/types";
import BarcodeSequenceForm from "@sequences/components/Barcode/BarcodeSequenceForm";
import { useLocationState } from "@utils/hooks";
import React from "react";
import styled from "styled-components";

const CenteredDialogContent = styled(DialogContent)`
    top: 50%;
`;

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
    const [locationState, setLocationState] = useLocationState();
    const mutation = useEditSequence(otuId);

    function onSubmit({ accession, definition, host, sequence, target }) {
        mutation.mutate(
            { isolateId, sequenceId: activeSequence.id, accession, definition, host, sequence, target },
            {
                onSuccess: () => {
                    setLocationState({ editSequence: false });
                },
            },
        );
    }

    return (
        <Dialog open={locationState?.editSequence} onOpenChange={() => setLocationState({ editSequence: false })}>
            <DialogPortal>
                <DialogOverlay />
                <CenteredDialogContent>
                    <DialogTitle>Edit Sequence</DialogTitle>
                    <BarcodeSequenceForm
                        activeSequence={activeSequence}
                        noun="edit"
                        onSubmit={onSubmit}
                        otuId={otuId}
                        targets={targets}
                    />
                </CenteredDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
