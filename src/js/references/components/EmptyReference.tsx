import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Alert, Button } from "../../base";
import { useCreateReference } from "../querys";
import { ReferenceDataType } from "../types";
import { DataTypeSelection } from "./DataTypeSelection";
import { ReferenceForm } from "./ReferenceForm";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
    dataType: Yup.string().required("Required Field"),
});

function getInitialState() {
    return {
        name: "",
        description: "",
        dataType: "genome",
        organism: "",
        mode: "empty",
    };
}

type formValues = {
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

    function onSubmit({ name, description, dataType, organism }) {
        mutation.mutate({ name, description, dataType, organism });
    }

    const {
        formState: { errors },
        handleSubmit,
        control,
        register,
    } = useForm({ defaultValues: { name: "", description: "", dataType: "genome", organism: "" } });

    return (
        <form onSubmit={handleSubmit(values => mutation.mutate({ ...values }))}>
            <Alert>
                <strong>Create an empty reference.</strong>
            </Alert>
            <ReferenceForm errors={errors} mode={"empty"} register={register} />
            <DataTypeSelection onSelect={datatype => setFieldValue("dataType", datatype)} dataType={values.dataType} />
            <Button type="submit" icon="save" color="blue">
                Save
            </Button>
        </form>
    );
}
