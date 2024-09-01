import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import { useUpdateOTU } from "@otus/queries";
import { Molecule, OTUSegment } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
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
    const navigate = useNavigate();
    const location = useLocation();
    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        mutation.mutate(
            { otuId, name, abbreviation, schema: [...schema, { name: segmentName, molecule, required }] },
            {
                onSuccess: () => {
                    navigate(".", { replace: true, state: { addSegment: false } });
                },
            }
        );
    }

    return (
        <Dialog
            open={location.state?.addSegment}
            onOpenChange={() => navigate(".", { replace: true, state: { addSegment: false } })}
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
