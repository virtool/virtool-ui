import Button from "@base/Button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";
import AdministratorForm from "./AdministratorForm";

export default function AdministratorCreate() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <Button as={DialogTrigger} color="blue">
                Create
            </Button>
            <DialogContent>
                <DialogTitle>Grant Administrator Privileges</DialogTitle>
                <AdministratorForm onClose={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
