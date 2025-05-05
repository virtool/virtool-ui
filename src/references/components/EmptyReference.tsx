import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "../../app/hooks";
import Button from "../../base/Button";
import DialogFooter from "../../base/DialogFooter";
import { useCreateReference } from "../queries";
import { ReferenceForm, ReferenceFormMode } from "./ReferenceForm";

type FormValues = {
    name: string;
    description: string;
    organism: string;
};

/**
 * A form for creating an empty reference
 */
export default function EmptyReference() {
    const navigate = useNavigate();

    const mutation = useCreateReference();

    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: "",
            organism: "",
        },
    });

    return (
        <form
            onSubmit={handleSubmit((values) =>
                mutation.mutate(values, {
                    onSuccess: () => {
                        navigate("/refs");
                    },
                }),
            )}
        >
            <ReferenceForm
                errors={errors}
                mode={ReferenceFormMode.empty}
                register={register}
            />
            <DialogFooter>
                <Button type="submit" color="blue">
                    Save
                </Button>
            </DialogFooter>
        </form>
    );
}
