import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import SegmentForm from "@otus/components/Detail/Schema/SegmentForm";
import { OTUQueryKeys, useUpdateOTU } from "@otus/queries";
import { Molecule, OTUSegment } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { map } from "lodash";
import { find } from "lodash-es";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

type FormValues = {
    segmentName: string;
    molecule: Molecule;
    required: boolean;
};

type EditSegmentProps = {
    abbreviation: string;
    name: string;
    otuId: string;
    /** The segments associated with the otu */
    schema: OTUSegment[];
};

/**
 * Displays a dialog to edit a segment
 */
export default function EditSegment({ abbreviation, otuId, name, schema }: EditSegmentProps) {
    const history = useHistory();
    const location = useLocation<{ editSegment: "" }>();
    const mutation = useUpdateOTU();
    const queryClient = useQueryClient();

    const initialName = location.state?.editSegment;
    const segment = find(schema, { name: initialName });

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        const newArray = map(schema, item => {
            return item.name === initialName ? { name: segmentName, molecule, required } : item;
        });

        mutation.mutate(
            { otuId, name, abbreviation, schema: newArray },
            {
                onSuccess: () => {
                    history.replace({ state: { editSegment: "" } });
                    queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                },
            },
        );
    }

    return (
        <Dialog
            open={Boolean(location.state?.editSegment)}
            onOpenChange={() => history.replace({ state: { editSegment: "" } })}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Segment</DialogTitle>
                    <SegmentForm
                        segmentName={initialName}
                        molecule={segment?.molecule}
                        required={segment?.required}
                        onSubmit={handleSubmit}
                        schema={schema}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
