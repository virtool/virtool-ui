import Button from "@base/Button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@base/Dialog";
import IconButton from "@base/IconButton";
import { JobNested } from "@jobs/types";
import { useRemoveSample } from "@samples/queries";
import { checkCanDeleteSample } from "@samples/utils";
import { Trash } from "lucide-react";
import { useState } from "react";

type DeleteSampleProps = {
    /** The id of the sample being deleted */
    id: string;

    /** The sample's job if it exists */
    job?: JobNested;

    /** The name of the sample being deleted */
    name: string;

    /** Whether the sample is ready */
    ready: boolean;
};

/**
 * Displays a dialog for deleting a sample
 */
export default function DeleteSample({
    id,
    job,
    name,
    ready,
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
                <IconButton color="red" IconComponent={Trash} tip="delete" />
            </DialogTrigger>
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
        </Dialog>
    );
}
