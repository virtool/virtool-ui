import Button from "@base/Button";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import AdministratorForm from "./AdministratorForm";

export default function AdministratorCreate() {
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
