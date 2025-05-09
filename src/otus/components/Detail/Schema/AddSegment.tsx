import { useDialogParam } from "@app/hooks";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import Dialog from "../../../../base/Dialog";
import DialogContent from "../../../../base/DialogContent";
import DialogOverlay from "../../../../base/DialogOverlay";
import DialogTitle from "../../../../base/DialogTitle";
import { useUpdateOTU } from "../../../queries";
import { Molecule, OtuSegment } from "../../../types";
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
    schema: OtuSegment[];
};

/**
 * Displays a dialog for adding a segment
 */
export default function AddSegment({
    otuId,
    name,
    abbreviation,
    schema,
}: AddSegmentProps) {
    const { open: openAddSegment, setOpen: setOpenAddSegment } =
        useDialogParam("openAddSegment");
    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        mutation.mutate(
            {
                otuId,
                name,
                abbreviation,
                schema: [...schema, { name: segmentName, molecule, required }],
            },
            {
                onSuccess: () => {
                    setOpenAddSegment(false);
                },
            },
        );
    }

    return (
        <Dialog
            open={openAddSegment}
            onOpenChange={() => setOpenAddSegment(false)}
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
