import { useDialogParam } from "@app/hooks";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useUpdateOTU } from "@otus/queries";
import { Molecule, OtuSegment } from "@otus/types";
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
            <DialogContent>
                <DialogTitle>Add Segment</DialogTitle>
                <SegmentForm onSubmit={handleSubmit} schema={schema} />
            </DialogContent>
        </Dialog>
    );
}
