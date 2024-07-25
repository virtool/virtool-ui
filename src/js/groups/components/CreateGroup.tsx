import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    SaveButton,
} from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { useCreateGroup } from "../queries";

type FormValues = {
    name: string;
};

/**
 * A dialog for creating a new group
 */
export default function CreateGroup() {
    const history = useHistory();
    const location = useLocation<{ createGroup: boolean }>();
    const createGroupMutation = useCreateGroup();
    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<FormValues>({ defaultValues: { name: "" } });

    function onSubmit({ name }: FormValues) {
        createGroupMutation.mutate(
            { name },
            {
                onSuccess: () => {
                    history.replace({ state: { createGroup: false } });
                },
            }
        );
    }

    return (
        <Dialog
            open={location.state?.createGroup}
            onOpenChange={() => history.replace({ state: { createGroup: false } })}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create Group</DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup>
                            <InputLabel>Name</InputLabel>
                            <InputSimple
                                id="name"
                                {...register("name", { required: "Provide a name for the group" })}
                            />
                            <InputError>{errors.name?.message}</InputError>
                        </InputGroup>
                        <DialogFooter>
                            <SaveButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
