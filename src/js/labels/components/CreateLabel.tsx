import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useCreateLabel } from "../queries";
import { LabelForm } from "./LabelForm";

type NewLabel = {
    color: string;
    description: string;
    name: string;
};

/**
 * Displays a dialog for creating a label
 */
export function CreateLabel() {
    const [open, setOpen] = useState(false);
    const mutation = useCreateLabel();

    function handleSubmit({ color, name, description }: NewLabel) {
        mutation.mutate(
            { color, description, name },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={open => setOpen(open)}>
            <Button as={DialogTrigger} color="blue">
                Create
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create a Label</DialogTitle>
                    <LabelForm
                        error={mutation.isError && mutation.error.response.body.message}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
