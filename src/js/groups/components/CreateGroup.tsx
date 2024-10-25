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
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { useCreateGroup } from "../queries";

type FormValues = {
    name: string;
};

/**
 * A dialog for creating a new group
 */
export default function CreateGroup() {
    const [openCreateGroup, setOpenCreateGroup] = useUrlSearchParam("openCreateGroup");
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
                    setOpenCreateGroup("");
                },
            },
        );
    }

    return (
        <Dialog open={Boolean(openCreateGroup)} onOpenChange={() => setOpenCreateGroup("")}>
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