import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import { useCreateSequence } from "@otus/queries";
import { OTUSegment, OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useDialogParam } from "@utils/hooks";
import { compact, map } from "lodash-es";
import React from "react";
import SequenceForm from "./SequenceForm";

type CreateSequenceProps = {
    isolateId: string;
    otuId: string;
    refId: string;
    schema: OTUSegment[];
    sequences: OTUSequence[];
};

/**
 * Displays dialog to add a genome sequence
 */
export default function CreateSequence({
    isolateId,
    otuId,
    refId,
    schema,
    sequences,
}: CreateSequenceProps) {
    const { open: openCreateSequence, setOpen: setOpenCreateSequence } =
        useDialogParam("openCreateSequence");

    const mutation = useCreateSequence(otuId);

    const segments = schema.filter(
        (segment) => !compact(map(sequences, "segment")).includes(segment.name),
    );

    function onSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            {
                accession,
                definition,
                host,
                isolateId,
                segment,
                sequence: sequence.toUpperCase(),
            },
            {
                onSuccess: () => {
                    setOpenCreateSequence(false);
                },
            },
        );
    }

    return (
        <Dialog
            open={openCreateSequence}
            onOpenChange={() => setOpenCreateSequence(false)}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="top-1/2">
                    <DialogTitle>Create Sequence</DialogTitle>
                    <SequenceForm
                        hasSchema={schema.length > 0}
                        noun="create"
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
