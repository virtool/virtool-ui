import { useCreateUser } from "@administration/queries";
import {
    Button,
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
} from "@base";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { useDialogParam } from "@utils/hooks";
import React from "react";
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
    const mutation = useCreateUser();
    const { open: openCreateUser, setOpen: setOpenCreateUser } =
        useDialogParam("openCreateUser");

    function handleSubmit({ handle, password, forceReset }: NewUser) {
        mutation.mutate(
            { handle, password, forceReset },
            {
                onSuccess: () => {
                    setOpenCreateUser(false);
                },
            },
        );
    }

    function onOpenChange(open) {
        mutation.reset();
        setOpenCreateUser(open);
    }

    return (
        <Dialog open={openCreateUser} onOpenChange={onOpenChange}>
            <Button as={DialogTrigger} color="blue">
                Create
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create User</DialogTitle>
                    <CreateUserForm
                        onSubmit={handleSubmit}
                        error={
                            mutation.isError &&
                            mutation.error.response?.body.message
                        }
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
