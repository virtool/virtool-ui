import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { useAddSequence } from "@otus/queries";
import { OTUSegment, OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import GenomeSequenceForm from "@sequences/components/Genome/GenomeSequenceForm";
import { useLocationState } from "@utils/hooks";
import { compact, map } from "lodash-es/lodash";
import React from "react";
import styled from "styled-components";

export const StyledContent = styled(DialogContent)`
    top: 50%;
`;

type AddGenomeSequenceProps = {
    isolateId: string;
    otuId: string;
    refId: string;
    schema: OTUSegment[];
    sequences: OTUSequence[];
};

/**
 * Displays dialog to add a genome sequence
 */
export default function AddGenomeSequence({ isolateId, otuId, refId, schema, sequences }: AddGenomeSequenceProps) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useAddSequence(otuId);

    const referencedSegmentNames = compact(map(sequences, "segment"));
    const segments = schema.filter(segment => !referencedSegmentNames.includes(segment.name));

    function onSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            { isolateId, accession, definition, host, segment, sequence: sequence.toUpperCase() },
            {
                onSuccess: () => {
                    setLocationState({ addSequence: false });
                },
            },
        );
    }

    return (
        <Dialog open={locationState?.addSequence} onOpenChange={() => setLocationState({ addSequence: false })}>
            <DialogPortal>
                <DialogOverlay />
                <StyledContent>
                    <DialogTitle>Add Sequence</DialogTitle>
                    <GenomeSequenceForm
                        hasSchema={schema.length > 0}
                        noun="add"
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
