import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle, Icon } from "../../base";
import { labelQueryKeys, useUpdateLabel } from "../queries";
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
    const queryClient = useQueryClient();

    function handleSubmit({ color, description, name }: UpdatedLabel) {
        mutation.mutate(
            { labelId: id, name, description, color },
            {
                onSuccess: () => {
                    setShow(false);
                    queryClient.invalidateQueries(labelQueryKeys.lists());
                },
            }
        );
    }

    return (
        <Dialog open={show} onOpenChange={show => setShow(show)}>
            <Button as={DialogTrigger} size="small">
                <Icon name="pen" />
                <span>Edit</span>
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit a label</DialogTitle>
                    <LabelForm color={color} description={description} name={name} onSubmit={handleSubmit} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
