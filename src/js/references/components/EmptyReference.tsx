import { Button, DialogFooter } from "@base";
import { useNavigate } from "@utils/hooks";
import React from "react";
import { useForm } from "react-hook-form";
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
                    onError: (err) => {
                        console.log(err);
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
