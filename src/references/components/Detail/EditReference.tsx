import { useDialogParam } from "@app/hooks";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@base/Dialog";
import SaveButton from "@base/SaveButton";
import { useUpdateReference } from "@references/queries";
import { Reference } from "@references/types";
import { useForm } from "react-hook-form";
import { ReferenceForm, ReferenceFormMode } from "../ReferenceForm";

export type FormValues = {
    name: string;
    description: string;
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
        </Dialog>
    );
}
