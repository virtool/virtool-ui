import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { createUser } from "../../administration/api";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { User } from "../types";
import { CreateUserForm } from "./CreateUserForm";

type ErrorResponse = {
    response: {
        body: {
            message: string;
        };
    };
};

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
    const mutation = useMutation<User, ErrorResponse, NewUser>(createUser, {
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
            <Button as={DialogTrigger} color="blue">
                Create
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create User</DialogTitle>
                    <CreateUserForm
                        onSubmit={handleSubmit}
                        error={mutation.isError && mutation.error.response?.body.message}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
