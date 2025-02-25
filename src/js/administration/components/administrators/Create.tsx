import {
    Button,
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
} from "@base";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { AdministratorForm } from "./Form";

export function CreateAdministrator() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <Button as={DialogTrigger} color="blue">
                Create
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Grant Administrator Privileges</DialogTitle>
                    <AdministratorForm onClose={() => setOpen(false)} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
