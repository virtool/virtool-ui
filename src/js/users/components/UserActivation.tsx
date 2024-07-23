import { useUpdateUser } from "@administration/queries";
import { Button, Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from "@base";
import { DialogClose, DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import styled from "styled-components";

const CapitalizedTitle = styled(DialogTitle)`
    text-transform: capitalize;
`;

/**
 * A dialog that requests confirmation for deactivating or reactivating a user
 */
export function UserActivation({ handle, id, noun, onHide, show }) {
    const mutation = useUpdateUser();

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <CapitalizedTitle>{noun} User</CapitalizedTitle>
                    <span>
                        Are you sure you want to {noun} <strong>{handle}</strong>?
                    </span>

                    <DialogFooter>
                        <DialogClose>
                            <Button
                                color={noun === "deactivate" ? "red" : "green"}
                                icon="check"
                                onClick={() =>
                                    mutation.mutate({
                                        userId: id,
                                        update: { active: noun !== "deactivate" },
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
