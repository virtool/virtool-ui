import { useCreateUser } from "@administration/queries";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
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
    const navigate = useNavigate();
    const location = useLocation();

    const mutation = useCreateUser();

    function handleSubmit({ handle, password, forceReset }: NewUser) {
        mutation.mutate({ handle, password, forceReset });
    }

    function onOpenChange() {
        mutation.reset();
        navigate(location, {
            state: { createUser: !location.state?.createUser },
            replace: true,
        });
    }

    return (
        <Dialog open={location.state?.createUser} onOpenChange={onOpenChange}>
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
