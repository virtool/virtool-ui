import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogFooter from "@base/DialogFooter";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { useUpdateSubtraction } from "../../queries";
import { Subtraction } from "../../types";

type EditSubtractionProps = {
    /** The subtraction data */
    subtraction: Subtraction;
    /** Indicates whether the modal for editing a subtraction is visible */
    show: boolean;
    /** A callback function to hide the modal */
    onHide: () => void;
};

/**
 * Dialog for editing an existing subtraction
 */
export default function EditSubtraction({
    subtraction,
    show,
    onHide,
}: EditSubtractionProps) {
    const mutation = useUpdateSubtraction(subtraction.id);

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            name: subtraction.name,
            nickname: subtraction.nickname,
        },
    });

    function onSubmit({ name, nickname }) {
        mutation.mutate({ name, nickname });
        onHide();
    }

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Subtraction</DialogTitle>
                    <form
                        onSubmit={handleSubmit((values) =>
                            onSubmit({ ...values }),
                        )}
                    >
                        <InputGroup>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <InputSimple
                                id="name"
                                {...register("name", {
                                    required: "A name must be provided",
                                })}
                            />
                            <InputError>{errors.name?.message}</InputError>
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="nickname">Nickname</InputLabel>
                            <InputSimple
                                id="nickname"
                                {...register("nickname")}
                            />
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
