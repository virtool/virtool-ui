import Button from "@base/Button";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import Icon from "@base/Icon";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useUpdateLabel } from "../queries";
import { LabelForm } from "./LabelForm";

type UpdatedLabel = {
    color: string;
    description: string;
    name: string;
};

type EditLabelProps = {
    /** The id of the label being updated */
    id: number;
    color: string;
    description: string;
    name: string;
};

/**
 * Displays a dialog for updating a label
 */
export function EditLabel({ id, color, name, description }: EditLabelProps) {
    const [show, setShow] = useState(false);
    const mutation = useUpdateLabel();

    function handleSubmit({ color, description, name }: UpdatedLabel) {
        mutation.mutate(
            { labelId: id, name, description, color },
            {
                onSuccess: () => {
                    setShow(false);
                },
            },
        );
    }

    return (
        <Dialog open={show} onOpenChange={(show) => setShow(show)}>
            <Button as={DialogTrigger} size="small">
                <Icon name="pen" />
                <span>Edit</span>
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit a label</DialogTitle>
                    <LabelForm
                        color={color}
                        description={description}
                        name={name}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
