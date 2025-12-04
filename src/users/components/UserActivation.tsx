import { useUpdateUser } from "@administration/queries";
import Button from "@base/Button";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogFooter from "@base/DialogFooter";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { DialogClose, DialogPortal } from "@radix-ui/react-dialog";
import styled from "styled-components";

const CapitalizedTitle = styled(DialogTitle)`
    text-transform: capitalize;
`;

type UserActivationProps = {
    /** The human interpretable name of the user */
    handle: string;
    /** The users unique identifier */
    id: number;
    /** noun indicating if the user is being activated or deactivated */
    noun: string;
    /** callback for closing the dialog */
    onHide: () => void;
    /** whether the dialog should be displayed */
    show: boolean;
};

/**
 * A dialog that requests confirmation for deactivating or reactivating a user
 */
export function UserActivation({
    handle,
    id,
    noun,
    onHide,
    show,
}: UserActivationProps) {
    const mutation = useUpdateUser();

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <CapitalizedTitle>{noun} User</CapitalizedTitle>
                    <span>
                        Are you sure you want to {noun}{" "}
                        <strong>{handle}</strong>?
                    </span>

                    <DialogFooter>
                        <DialogClose>
                            <Button
                                color={noun === "deactivate" ? "red" : "green"}
                                onClick={() =>
                                    mutation.mutate({
                                        userId: id,
                                        update: {
                                            active: noun !== "deactivate",
                                        },
                                    })
                                }
                            >
                                Confirm
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
