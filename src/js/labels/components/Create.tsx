import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Request } from "../../app/request";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { StyledButton } from "../../base/styled/StyledButton";
import { LabelForm } from "./Form";

export function CreateLabel() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation(
        newLabel => {
            return Request.post("/api/labels").send(newLabel);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("labels");
                setOpen(false);
            },
            onError: error => {
                setError(error.response.body.message);
            }
        }
    );

    const handleSubmit = ({ color, name, description }) => {
        const data = { color, description, name };
        mutation.mutate(data, {});
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
