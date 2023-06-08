import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, Icon } from "../../../base";
import { StyledButton } from "../../../base/styled/StyledButton";
import { AdministratorForm } from "./Form";

export const CreateAdministrator = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={open => setOpen(open)}>
            <StyledButton as={DialogTrigger} color="blue" aria-label="create">
                <Icon name="plus-square" />
            </StyledButton>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Grant Administrator Privileges</DialogTitle>
                    <AdministratorForm onClose={() => setOpen(false)} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};
