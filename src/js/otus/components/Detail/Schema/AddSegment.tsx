import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import { OTUQueryKeys, useUpdateOTU } from "@otus/queries";
import { Molecule, OTUSegment } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import SegmentForm from "./SegmentForm";

type FormValues = {
    segmentName: string;
    molecule: Molecule;
    required: boolean;
};

type AddSegmentProps = {
    abbreviation: string;
    name: string;
    otuId: string;
    /** The segments associated with the otu */
    schema: OTUSegment[];
};

/**
 * Displays a dialog for adding a segment
 */
export default function AddSegment({ otuId, name, abbreviation, schema }: AddSegmentProps) {
    const history = useHistory();
    const location = useLocation<{ addSegment: boolean }>();
    const mutation = useUpdateOTU();
    const queryClient = useQueryClient();

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        mutation.mutate(
            { otuId, name, abbreviation, schema: [...schema, { name: segmentName, molecule, required }] },
            {
                onSuccess: () => {
                    history.replace({ state: { addSegment: false } });
                    queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                },
            },
        );
    }

    return (
        <Dialog
            open={location.state?.addSegment}
            onOpenChange={() => history.replace({ state: { addSegment: false } })}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Add Segment</DialogTitle>
                    <SegmentForm onSubmit={handleSubmit} schema={schema} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
