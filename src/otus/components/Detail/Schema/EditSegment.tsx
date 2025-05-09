import { useUrlSearchParam } from "@app/hooks";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { DialogPortal } from "@radix-ui/react-dialog";
import { map } from "lodash";
import { find } from "lodash-es";
import React from "react";
import { useUpdateOTU } from "../../../queries";
import { Molecule, OtuSegment } from "../../../types";
import SegmentForm from "./SegmentForm";

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
    schema: OtuSegment[];
};

/**
 * Displays a dialog to edit a segment
 */
export default function EditSegment({
    abbreviation,
    otuId,
    name,
    schema,
}: EditSegmentProps) {
    const { value: editSegmentName, unsetValue: unsetEditSegmentName } =
        useUrlSearchParam<string>("editSegmentName");
    const mutation = useUpdateOTU(otuId);

    const segment = find(schema, { name: editSegmentName });

    function handleSubmit({ segmentName, molecule, required }: FormValues) {
        const newArray = map(schema, (item) => {
            return item.name === editSegmentName
                ? { name: segmentName, molecule, required }
                : item;
        });

        mutation.mutate(
            { otuId, name, abbreviation, schema: newArray },
            {
                onSuccess: () => {
                    unsetEditSegmentName();
                },
            },
        );
    }

    return (
        <Dialog
            open={Boolean(editSegmentName)}
            onOpenChange={() => unsetEditSegmentName()}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Segment</DialogTitle>
                    <SegmentForm
                        segmentName={editSegmentName}
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
