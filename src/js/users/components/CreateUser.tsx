import { useCreateUser } from "@administration/queries";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { useUrlSearchParam } from "@utils/hooks";
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
    const [openCreateUser, setOpenCreateUser] = useUrlSearchParam("openCreateUser");

    function handleSubmit({ handle, password, forceReset }: NewUser) {
        mutation.mutate(
            { handle, password, forceReset },
            {
                onSuccess: () => {
                    setOpenCreateUser("");
                },
            },
        );
    }

    function onOpenChange(open) {
        mutation.reset();
        setOpenCreateUser(open);
    }

    return (
        <Dialog open={Boolean(openCreateUser)} onOpenChange={onOpenChange}>
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
