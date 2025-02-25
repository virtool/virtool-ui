import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    SaveButton,
} from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUpdateReference } from "@references/queries";
import { useDialogParam } from "@utils/hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { Reference, ReferenceDataType } from "../../types";
import { ReferenceForm, ReferenceFormMode } from "../ReferenceForm";

export type FormValues = {
    name: string;
    description: string;
    dataType: ReferenceDataType;
    organism: string;
};

type EditReferenceProps = {
    /** The reference details */
    detail: Reference;
};

/**
 * A dialog for editing a reference
 */
export default function EditReference({ detail }: EditReferenceProps) {
    const { open: openEditReference, setOpen: setOpenEditReference } =
        useDialogParam("openEditReference");
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormValues>({
        defaultValues: {
            name: detail.name,
            description: detail.description,
            organism: detail.organism,
        },
    });
    const { mutation } = useUpdateReference(detail.id);

    function handleEdit({ name, description, organism }) {
        mutation.mutate({ name, description, organism });
        setOpenEditReference(false);
    }

    return (
        <Dialog
            open={openEditReference}
            onOpenChange={() => setOpenEditReference(false)}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Reference</DialogTitle>
                    <form
                        onSubmit={handleSubmit((values) =>
                            handleEdit({ ...values }),
                        )}
                    >
                        <ReferenceForm
                            errors={errors}
                            mode={ReferenceFormMode.edit}
                            register={register}
                        />
                        <DialogFooter>
                            <SaveButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
