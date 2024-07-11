import { Button, Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import styled from "styled-components";

const CapitalizedTitle = styled(DialogTitle)`
    text-transform: capitalize;
`;

/**
 * A dialog that requests confirmation from the user for deleting a document or other sensitive information
 */
export function UserActivation({ handle, noun, onHide, show }) {
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
                        <Button color={noun === "deactivate" ? "red" : "green"} icon="check" onClick={null}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
