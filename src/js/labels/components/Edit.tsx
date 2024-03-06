import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Request } from "../../app/request";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, Icon } from "../../base";
import { StyledButtonSmall } from "../../base/styled/StyledButtonSmall";
import { labelQueryKeys } from "../queries";
import { LabelForm } from "./Form";

interface EditLabelProps {
    id: string;
    color: string;
    description: string;
    name: string;
}

export function EditLabel({ id, color, name, description }: EditLabelProps) {
    const [show, setShow] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation(data => {
        return Request.patch(`/labels/${id}`)
            .send(data)
            .then(response => {
                return response.body;
            });
    });

    const handleSubmit = data => {
        mutation.mutate(data, {
            onSuccess: () => {
                setShow(false);
                queryClient.invalidateQueries(labelQueryKeys.lists());
            },
        });
    };

    return (
        <Dialog open={show} onOpenChange={show => setShow(show)}>
            <StyledButtonSmall as={DialogTrigger}>
                <Icon name="pen" />
                <span>Edit</span>
            </StyledButtonSmall>
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
