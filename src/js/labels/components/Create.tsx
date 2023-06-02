import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ResponseError } from "superagent";
import { Request } from "../../app/request";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { StyledButton } from "../../base/styled/StyledButton";
import { LabelForm } from "./Form";

type NewLabel = {
    color: string;
    description: string;
    name: string;
};

export function CreateLabel() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newLabel: NewLabel) => {
            return Request.post("/labels").send(newLabel);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("labels");
                setOpen(false);
            },
            onError: (error: ResponseError) => {
                setError(error.response.body.message);
            },
        },
    );

    const handleSubmit = ({ color, name, description }: NewLabel) => {
        mutation.mutate({ color, description, name });
    };

    return (
        <Dialog open={open} onOpenChange={open => setOpen(open)}>
            <StyledButton as={DialogTrigger} color="blue">
                Create
            </StyledButton>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create a Label</DialogTitle>
                    <LabelForm error={error} onSubmit={handleSubmit} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
