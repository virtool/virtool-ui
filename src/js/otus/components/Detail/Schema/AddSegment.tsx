import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/base";
import { useUpdateOTU } from "@otus/queries";
import { Molecule, OTUSegment } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
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
    const [openAddSegment, setOpenAddSegment] = useUrlSearchParam("openAddSegment");
    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        mutation.mutate(
            { otuId, name, abbreviation, schema: [...schema, { name: segmentName, molecule, required }] },
            {
                onSuccess: () => {
                    setOpenAddSegment("");
                },
            },
        );
    }

    return (
        <Dialog open={Boolean(openAddSegment)} onOpenChange={() => setOpenAddSegment("")}>
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
