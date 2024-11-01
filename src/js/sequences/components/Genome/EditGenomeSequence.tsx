import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useEditSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import GenomeSequenceForm from "@sequences/components/Genome/GenomeSequenceForm";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import { useGetActiveSequence, useGetUnreferencedSegments } from "@sequences/hooks";

type EditGenomeSequenceProps = {
    hasSchema: boolean;
    isolateId: string;
    otuId: string;
    refId: string;
};

/**
 * Displays dialog to edit a genome sequence
 */
export default function EditGenomeSequence({ hasSchema, isolateId, otuId, refId }: EditGenomeSequenceProps) {
    const { value: editSequenceId, unsetValue: unsetEditSequenceId } = useUrlSearchParam("editSequenceId");
    const mutation = useEditSequence(otuId);

    const segments = useGetUnreferencedSegments();
    const activeSequence = useGetActiveSequence();

    function onSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            { isolateId, sequenceId: activeSequence.id, accession, definition, host, segment, sequence },
            {
                onSuccess: () => {
                    unsetEditSequenceId();
                },
            },
        );
    }

    return (
        <Dialog open={Boolean(editSequenceId)} onOpenChange={() => unsetEditSequenceId()}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="top-1/2">
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
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
