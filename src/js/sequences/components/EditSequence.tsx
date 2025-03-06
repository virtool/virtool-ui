import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import { useUrlSearchParam } from "@/hooks";
import { useCurrentOtuContext, useEditSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import {
    useGetActiveSequence,
    useGetUnreferencedSegments,
} from "@sequences/hooks";
import React from "react";
import SequenceForm from "./SequenceForm";

/**
 * Displays dialog to edit a genome sequence
 */
export default function EditSequence() {
    const { value: isolateId } = useUrlSearchParam<string>("activeIsolate");
    const { otu, reference } = useCurrentOtuContext();

    const hasSchema = Boolean(otu.schema.length);

    const { value: editSequenceId, unsetValue: unsetEditSequenceId } =
        useUrlSearchParam("editSequenceId");

    const mutation = useEditSequence(otu.id);

    const segments = useGetUnreferencedSegments();
    const activeSequence = useGetActiveSequence();

    function onSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            {
                isolateId,
                sequenceId: activeSequence.id,
                accession,
                definition,
                host,
                segment,
                sequence,
            },
            {
                onSuccess: () => {
                    unsetEditSequenceId();
                },
            },
        );
    }

    return (
        <Dialog
            open={Boolean(editSequenceId)}
            onOpenChange={() => unsetEditSequenceId()}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="top-1/2">
                    <DialogTitle>Edit Sequence</DialogTitle>
                    <SequenceForm
                        activeSequence={activeSequence}
                        hasSchema={hasSchema}
                        noun="edit"
                        onSubmit={onSubmit}
                        otuId={otu.id}
                        refId={reference.id}
                        segments={segments}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
