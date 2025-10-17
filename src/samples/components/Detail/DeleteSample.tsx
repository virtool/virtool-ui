import Button from "@base/Button";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogFooter from "@base/DialogFooter";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import IconButton from "@base/IconButton";
import { JobMinimal } from "@jobs/types";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { useRemoveSample } from "@samples/queries";
import { checkCanDeleteSample } from "@samples/utils";
import { useState } from "react";

type DeleteSampleProps = {
    /** The id of the sample being deleted */
    id: string;
    /** The name of the sample being deleted */
    name: string;
    /** Whether the sample is ready */
    ready: boolean;
    /** The sample's job if it exists */
    job?: JobMinimal;
};

/**
 * Displays a dialog for deleting a sample
 */
export default function DeleteSample({
    id,
    name,
    ready,
    job,
}: DeleteSampleProps) {
    const [open, setOpen] = useState(false);
    const mutation = useRemoveSample();

    if (!checkCanDeleteSample(ready, job)) {
        return null;
    }

    function handleConfirm() {
        mutation.mutate(
            { sampleId: id },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <IconButton color="red" name="trash" tip="delete" />
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Delete Sample</DialogTitle>
                    <span>
                        Are you sure you want to delete <strong>{name}</strong>?
                    </span>

                    <DialogFooter>
                        <Button color="red" onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
