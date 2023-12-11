import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import { useMutation } from "react-query";
import { createUser } from "../../administration/api";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, Icon } from "../../base";
import { StyledButton } from "../../base/styled/StyledButton";
import { CreateUserForm } from "./CreateUserForm";

type NewUser = {
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
    const mutation = useMutation(createUser, {
        onSuccess: () => {
            history.replaceState({ createUser: false }, "");
        },
    });

    function handleSubmit({ handle, password, forceReset }: NewUser) {
        mutation.mutate({ handle, password, forceReset });
    }

    function onOpenChange() {
        mutation.reset();
        history.replaceState({ createUser: !history.state?.createUser }, "");
    }

    return (
        <Dialog open={history.state?.createUser} onOpenChange={onOpenChange}>
            <StyledButton as={DialogTrigger} color="blue" aria-label="user-plus">
                <Icon name="user-plus" />
            </StyledButton>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create User</DialogTitle>
                    <CreateUserForm
                        onSubmit={handleSubmit}
                        error={mutation.isError && mutation.error["response"]?.body.message}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
