import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import { OTUQueryKeys, useUpdateOTU } from "@otus/queries";
import { Molecule, OTUSegment } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { find } from "lodash-es";
import React, { useState } from "react";
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
    const [error, setError] = useState("");
    const queryClient = useQueryClient();

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        const checkName = find(schema, { name: segmentName });

        if (checkName) {
            setError("Segment names must be unique. This name is currently in use.");
        } else {
            mutation.mutate(
                { otuId, name, abbreviation, schema: [...schema, { name: segmentName, molecule, required }] },
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
        history.replace({ state: { addSegment: false } });
    }

    return (
        <Dialog open={location.state?.addSegment} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Add Segment</DialogTitle>
                    <SegmentForm onSubmit={handleSubmit} error={error} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
