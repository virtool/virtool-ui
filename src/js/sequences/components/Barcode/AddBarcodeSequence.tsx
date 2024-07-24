import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useAddSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { ReferenceTarget } from "@references/types";
import BarcodeSequenceForm from "@sequences/components/Barcode/BarcodeSequenceForm";
import { useLocationState } from "@utils/hooks";
import { merge } from "lodash";
import React from "react";
import styled from "styled-components";

const CenteredDialogContent = styled(DialogContent)`
    top: 50%;
`;

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
    const [locationState, setLocationState] = useLocationState();
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
                    setLocationState(merge(locationState, { addSequence: false }));
                },
            }
        );
    }

    return (
        <Dialog
            open={locationState?.addSequence}
            onOpenChange={() => setLocationState(merge(locationState, { addSequence: false }))}
        >
            <DialogPortal>
                <DialogOverlay />
                <CenteredDialogContent>
                    <DialogTitle>Add Sequence</DialogTitle>
                    <BarcodeSequenceForm noun="add" onSubmit={onSubmit} otuId={otuId} targets={targets} />
                </CenteredDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
