import { Button, DialogFooter } from "@base";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useCreateReference } from "../queries";
import { ReferenceDataType } from "../types";
import { DataTypeSelection } from "./DataTypeSelection";
import { ReferenceForm, ReferenceFormMode } from "./ReferenceForm";

type FormValues = {
    name: string;
    description: string;
    dataType: ReferenceDataType;
    organism: string;
};

/**
 * A form for creating an empty reference
 */
export default function EmptyReference() {
    const [, navigate] = useLocation();

    const mutation = useCreateReference();

    const {
        formState: { errors },
        handleSubmit,
        register,
        control,
    } = useForm<FormValues>({ defaultValues: { name: "", description: "", dataType: "genome", organism: "" } });

    return (
        <form
            onSubmit={handleSubmit(values =>
                mutation.mutate(
                    { ...values },
                    {
                        onSuccess: () => {
                            navigate("~/refs");
                        },
                    }
                )
            )}
        >
            <ReferenceForm errors={errors} mode={ReferenceFormMode.empty} register={register} />
            <Controller
                name="dataType"
                control={control}
                rules={{ required: "Required Field" }}
                render={({ field: { onChange, value } }) => <DataTypeSelection onSelect={onChange} dataType={value} />}
            />
            <DialogFooter>
                <Button type="submit" color="blue">
                    Save
                </Button>
            </DialogFooter>
        </form>
    );
}
