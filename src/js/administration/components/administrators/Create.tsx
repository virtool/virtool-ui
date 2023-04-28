import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, Icon } from "../../../base";
import { StyledButton } from "../../../base/styled/StyledButton";
import { AdministratorRole } from "../../types";
import { AdministratorForm } from "./Form";

export const CreateAdministrator = ({ roles }: { roles: Array<AdministratorRole> }) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={open => setOpen(open)}>
            <StyledButton as={DialogTrigger} color="blue">
                <Icon name="plus-square" />
            </StyledButton>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Grant administrator privileges</DialogTitle>
                    <AdministratorForm roles={roles} onClose={() => setOpen(false)} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};
