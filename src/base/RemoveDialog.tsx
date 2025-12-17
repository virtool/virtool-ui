import { ReactNode } from "react";
import Button from "./Button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./Dialog";

type RemoveDialogProps = {
    /** A message to override the default one displayed in the dialog body */
    message?: ReactNode;
    /** The display name for the item to be removed */
    name: string;
    /** The type of document being removed (e.g. OTU) */
    noun: string;
    /** Whether the dialog is visible */
    show: boolean;
    /** A callback function to call on confirmation */
    onConfirm: () => void;
    /** A callback function that hides the dialog */
    onHide: () => void;
};

/**
 * A dialog that requests confirmation from the user for deleting a document or other sensitive information
 */
export default function RemoveDialog({
    message,
    name,
    noun,
    show,
    onConfirm,
    onHide,
}: RemoveDialogProps) {
    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogContent>
                <DialogTitle>{`Remove ${noun}`}</DialogTitle>
                {message || (
                    <span>
                        Are you sure you want to remove <strong>{name}</strong>?
                    </span>
                )}

                <DialogFooter>
                    <Button color="red" onClick={onConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
