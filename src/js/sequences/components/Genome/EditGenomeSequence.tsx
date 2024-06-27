import { Dialog, DialogOverlay, DialogTitle } from "@base";
import { useEditSequence } from "@otus/queries";
import { OTUSegment, OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import GenomeSequenceForm from "@sequences/components/Genome/GenomeSequenceForm";
import { useLocationState } from "@utils/hooks";
import React from "react";
import { StyledContent } from "./AddGenomeSequence";

type EditGenomeSequenceProps = {
    activeSequence: OTUSequence;
    hasSchema: boolean;
    isolateId: string;
    otuId: string;
    refId: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
};

/**
 * Displays dialog to edit a genome sequence
 */
export default function EditGenomeSequence({
    activeSequence,
    hasSchema,
    isolateId,
    otuId,
    refId,
    segments,
}: EditGenomeSequenceProps) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useEditSequence(otuId);

    function onSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            { isolateId, sequenceId: activeSequence.id, accession, definition, host, segment, sequence },
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
                <StyledContent>
                    <DialogTitle>Edit Sequence</DialogTitle>
                    <GenomeSequenceForm
                        activeSequence={activeSequence}
                        hasSchema={hasSchema}
                        noun="edit"
                        onSubmit={onSubmit}
                        otuId={otuId}
                        refId={refId}
                        segments={segments}
                    />
                </StyledContent>
            </DialogPortal>
        </Dialog>
    );
}
