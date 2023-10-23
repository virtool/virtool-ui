import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, Icon } from "../../base";
import { StyledButton } from "../../base/styled/StyledButton";
import { create } from "../api";
import { CreateUserForm } from "./CreateUserForm";

type NewUserProps = {
    /** The user's handle or username */
    handle: string;
    /** The user's password */
    password: string;
    /** Whether the user will be forced to reset their password on next login */
    forceReset: boolean;
};

/**
 * A dialog for creating a new user
 */
export default function CreateUser() {
    const [open, setOpen] = useState(false);
    const mutation = useMutation(create, {
        onSuccess: () => {
            setOpen(false);
        },
    });

    function handleSubmit({ handle, password, forceReset }: NewUserProps) {
        mutation.mutate({ handle, password, forceReset });
    }

    function handleChange(open: boolean) {
        setOpen(open);
        mutation.reset();
    }

    return (
        <Dialog open={open} onOpenChange={open => handleChange(open)}>
            <StyledButton as={DialogTrigger} color="blue">
                <Icon name="user-plus" />
            </StyledButton>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create User</DialogTitle>
                    <CreateUserForm
                        onSubmit={handleSubmit}
                        error={mutation.isError && mutation.error["response"].body.message}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
