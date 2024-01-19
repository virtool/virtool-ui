import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button } from "../../base";
import { useCreateReference } from "../querys";
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
    const mutation = useCreateReference();

    const {
        formState: { errors },
        handleSubmit,
        register,
        control,
    } = useForm<FormValues>({ defaultValues: { name: "", description: "", dataType: "genome", organism: "" } });

    return (
        <form onSubmit={handleSubmit(values => mutation.mutate({ ...values }))}>
            <Alert>
                <strong>Create an empty reference.</strong>
            </Alert>
            <ReferenceForm errors={errors} mode={ReferenceFormMode.empty} register={register} />
            <Controller
                name="dataType"
                control={control}
                rules={{ required: "Required Field" }}
                render={({ field: { onChange, value } }) => <DataTypeSelection onSelect={onChange} dataType={value} />}
            />
            <Button type="submit" icon="save" color="blue">
                Save
            </Button>
        </form>
    );
}
