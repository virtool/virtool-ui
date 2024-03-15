import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import SegmentForm from "@otus/components/Detail/Schema/SegmentForm";
import { OTUQueryKeys, useUpdateOTU } from "@otus/queries";
import { Molecule, OTUSegment } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { find, findIndex } from "lodash-es";
import React, { useState } from "react";
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
    const [error, setError] = useState("");
    const mutation = useUpdateOTU();
    const queryClient = useQueryClient();

    const initialName = location.state?.editSegment;
    const segment = find(schema, { name: initialName });

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        const checkName = find(schema, ["name", segmentName]);

        if (checkName && segmentName !== initialName) {
            setError("Segment names must be unique. This name is currently in use.");
        } else {
            const newArray = schema.slice();
            const index = findIndex(newArray, { name: initialName });
            newArray[index] = { name: segmentName, molecule, required };

            mutation.mutate(
                { otuId, name, abbreviation, schema: newArray },
                {
                    onSuccess: () => {
                        onHide();
                        queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                    },
                },
            );
        }
    }

    function onHide() {
        setError("");
        history.replace({ state: { editSegment: "" } });
    }

    return (
        <Dialog open={Boolean(location.state?.editSegment)} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Segment</DialogTitle>
                    <SegmentForm
                        segmentName={initialName}
                        molecule={segment?.molecule}
                        required={segment?.required}
                        error={error}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
